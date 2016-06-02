const fs = require('fs')
const path = require('path')
const restify = require('restify')
const request = require('request')

let server = restify.createServer()
server.use(restify.queryParser())
server.use(restify.CORS())
server.use(restify.gzipResponse())

server.get('/', (req, res, next) => {
  res.send({ status: 'ok' })
  next()
})

const DEFAULT_TYPES = ['BUILDING_KILL', 'ELITE_MONSTER_KILL']
const TIMELINE_CACHE = process.env.TIMELINE_CACHE || path.resolve(process.cwd(), 'timelines')
function fileExists (path) {
  try {
    fs.statSync(path).isFile()
  } catch (e) {
    return false
  }

  return true
}

server.get('/game/:region/:id', (req, res, next) => {
  let { region, id, gameHash, types } = req.params
  if (!gameHash) {
    res.send(503, { status: 'not ok', error: 'missing required query param `gameHash`' })
    return next()
  }
  if (!types) types = DEFAULT_TYPES

  let filePath = `${TIMELINE_CACHE}/${region}-${id}.json`
  if (fileExists(filePath)) {
    fs.readFile(filePath, (err, buf) => {
      if (err) throw err
      let body = JSON.parse(buf)

      let flattened = [].concat(...body.frames.map((frame) => frame.events))
      let events = flattened.filter((ev) => types.indexOf(ev.type) !== -1)
      res.send(200, { status: 'ok', events })
      next()
    })
  } else {
    request({
      method: 'GET',
      uri: `https://acs.leagueoflegends.com/v1/stats/game/${region}/${id}/timeline?gameHash=${gameHash}`,
      json: true
    }, (err, resp, body) => {
      if (err) throw err

      if (resp.statusCode !== 200) {
        res.send(resp.statusCode, { status: 'not ok', error: `riot API returned an error: ${body.errorCode} - ${body.message}` })
        return next()
      }

      let flattened = [].concat(...body.frames.map((frame) => frame.events))
      let events = flattened.filter((ev) => types.indexOf(ev.type) !== -1)
      res.send(200, { status: 'ok', events })
      next()

      fs.writeFile(filePath, JSON.stringify(body), (err) => {
        if (err) {
          console.log(`couldn't write file at ${filePath}`)
          console.error(err)
        }
      })
    })
  }
})

server.listen(8081, () => {
  console.log(`mh proxy server listening at ${server.url}`)
})
