const request = require('request')
const WebSocket = require('ws')
const fs = require('fs')
const fileExists = require('file-exists')

function formatTime (ms) {
  let min = (ms/1000/60) << 0
  let sec = (ms/1000) % 60 << 0

  return min + ':' + (sec < 10 ? '0' : '') + sec
}

let streams = {}
request('http://api.lolesports.com/api/issueToken', {json: true}, (err, res, body) => {
  if (err) throw err

  console.log('got token! connecting...')
  let ws = new WebSocket(`ws://livestats.proxy.lolesports.com/stats?jwt=${body.token}`)
  console.log('connected :)')

  ws.on('message', (msg) => {
    try {
      let json = JSON.parse(msg)
      Object.keys(json).forEach((key, i) => {
        let game = json[key]
        let livePath = `${process.cwd()}/live/${key}.json`
        let finishedPath = `${process.cwd()}/finished/${key}.json`
        if (!streams[key]) {
          console.log(`adding game ${key}`)
          streams[key] = fs.createWriteStream(livePath)
          streams[key].write(`{"id": "${game.generatedName}",\n"events":[\n`)
        }

        console.log(`event received for game ${key} at time ${formatTime(game.t)}`)
        let isComplete = (game.gameComplete || false)
        streams[key].write(JSON.stringify(game) + (isComplete ? '\n' : ',\n'))
        if (isComplete) {
          console.log(`finished game ${key} at time ${formatTime(game.t)}! doing final work...`)
          streams[key].end(']}\n', () => {
            streams[key].destroy()
            delete streams[key]
            if (!fileExists(finishedPath)) {
              console.log(`copying game ${key} to finished folder...`)
              fs.createReadStream(livePath).pipe(fs.createWriteStream(finishedPath).on('close', () => fs.unlinkSync(livePath)))
            } else {
              console.log(`finished file for game ${key} already existed -- will not overwrite :^)`)
              fs.unlinkSync(livePath)
            }
            console.log(`finished tasks for game ${key}! remaining games: ${Object.keys(streams).length}`)
          })
        }
      })
    } catch (e) {
      console.log('NON-JSON DATA')
      console.log(msg)
      console.error(e)
    }
  })
})
