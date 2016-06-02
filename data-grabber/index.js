const fs = require('fs')
const request = require('request')
const WebSocket = require('ws')
const fileExists = require('file-exists')
const _ = require('lodash')
const bunyan = require('bunyan')
const gcloud = require('gcloud')({
  projectId: process.env.LOL_TIMELINE_GCLOUD_PROJECT
})

const log = bunyan.createLogger({ name: 'data-grabber' })

function formatTime (ms) {
  let min = (ms / 1000 / 60) << 0
  let sec = (ms / 1000) % 60 << 0

  return min + ':' + (sec < 10 ? '0' : '') + sec
}

let games = {}
let gcs = gcloud.storage()
let matchesBucket = gcs.bucket(process.env.LOL_TIMELINE_GCLOUD_BUCKET)

function connectToSocket () {
  log.info('connecting to websocket...')
  request('http://api.lolesports.com/api/issueToken', { json: true }, (err, res, body) => {
    if (err) log.error(err)

    let ws = new WebSocket(`ws://livestats.proxy.lolesports.com/stats?jwt=${body.token}`)
    // let ws = new WebSocket(`ws://localhost:8080`) // used for simulation of livestats server

    ws.on('close', (code, message) => {
      log.warn('websocket has closed. info:')
      log.warn(`  code: ${code}`)
      log.warn(`  message: ${message}`)
      log.warn('reconnecting...')
      connectToSocket()
    })

    ws.on('error', (err) => {
      log.error('error reported:')
      log.error(err)
    })

    ws.on('message', (msg) => {
      let json = {}
      try {
        json = JSON.parse(msg)
      } catch (e) {
        log.warn('NON-JSON DATA')
        log.warn(msg)
        log.error(e)
      }

      Object.keys(json).forEach((key) => {
        let game = json[key]

        if (!games[key]) {
          log.info(`adding game ${game.realm}-${key}`)
          let filePath = `${process.cwd()}/games/${game.realm}-${key}.json`
          let fileExisted = fileExists(filePath)
          games[key] = {
            stream: fs.createWriteStream(filePath, { flags: 'a' }),
            obj: game,
            id: `${game.realm}-${key}`,
            written: fileExists(filePath + '.finished')
          }

          if (!fileExisted) {
            games[key].stream.write(`[\n`)
          }
        }

        if (games[key].written) {
          log.info(`finished file already exists for ${games[key].id} -- won't process again`)
          games[key].stream.destroy()
          return
        }

        log.info(`event received for game ${games[key].id} at time ${formatTime(game.t)}`)

        let isComplete = (game.gameComplete || false)
        games[key].obj = _.merge(games[key].obj, game)
        // special item logic -- the item array isn't a diff, it's the full items the player has
        // lodash.merge tries to merge arrays though, when we just want to outright replace it
        if (game.playerStats) {
          Object.keys(game.playerStats).forEach((id) => {
            let player = game.playerStats[id]

            if (player.items) {
              games[key].obj.playerStats[id].items = player.items
            }
          })
        }

        // don't bother writing the data for the first frames where player pos are 0
        if (games[key].obj.playerStats['1'].x !== 0) {
          games[key].stream.write(JSON.stringify(games[key].obj) + (isComplete ? '\n' : ',\n'))
        }

        if (isComplete) {
          log.info(`finished game ${games[key].id} at time ${formatTime(game.t)}! finishing up...`)

          games[key].stream.end(']\n', () => {
            games[key].stream.destroy()

            let filePath = `${process.cwd()}/games/${games[key].id}.json`

            fs.writeFile(filePath + '.finished', '', (err) => {
              if (err) log.error(err)
              games[key].written = true

              log.info(`uploading file for ${games[key].id}...`)
              matchesBucket.upload(filePath, {
                destination: `matches/${games[key].id}.json`,
                gzip: true,
                public: true
              }, (err) => {
                if (err) log.error(err)
                log.info(`uploaded file for ${games[key].id}!`)
              })
            })
          })
        }
      })
    })
  })
}

connectToSocket()
