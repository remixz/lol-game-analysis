const fs = require('fs')
const express = require('express')
const moment = require('moment')
const generateCsv = require('./generate-csv')

const app = express()
const template = fs.readFileSync('./csv-template.html').toString()

app.get('/', (req, res) => {
  fs.readdir(`${process.cwd()}/games`, (err, files) => {
    if (err) return res.send('<p> error :( tell zach </p>')

    files = files
      .filter((file) => file.endsWith('.json.finished'))
      .map((file) => ({ name: file.split('.json.finished')[0], date: fs.statSync(`${process.cwd()}/games/${file}`).birthtime.getTime()}))
      .sort((a, b) => b.date - a.date)
      .slice(0, 20)

    let out = ''
    files.forEach((file) => {
      out += `
      <li>
        <span class="name">${file.name}</span>
        <span> - </span>
        <span class="date" data-date=${file.date}>${moment(file.date).format('MMMM Do YYYY')}</span>
        <span> - <a href="/csv/${file.name}"> Download CSV</a> / <a href="https://timeline.bruggie.com/match/${file.name}" target="_blank"> Timeline </a> </span>
      </li>
      `
    })

    res.send(template.replace('{{ITEMS}}', out))
  })
})

app.get('/csv/:id', (req, res) => {
  fs.readFile(`${process.cwd()}/games/${req.params.id}.json`, (err, buf) => {
    if (err) return res.status(500).send('error: ' + err)

    let arr
    try {
      arr = JSON.parse(buf)
    } catch (e) {
     return res.status(500).send('error (probably an old file): ' + e)
    }
    let game = arr[arr.length - 1]
    generateCsv(game, (err, out) => {
      if (err) return res.status(500).send('error: ' + err)

      res.header('Content-Type', 'text/plain')
      res.send(out)
    })
  })
})

app.use(express.static('csv'))

app.listen(7797, () => {
  console.log('listening on http://localhost:7797')
})
