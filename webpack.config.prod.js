require('babel-core/register')

const fs = require('fs')
const getConfig = require('hjs-webpack')
const React = require('react')
const ReactDOMServer = require('react-dom/server')
const App = require('./src/views/app').default

const rawData = fs.readFileSync('./public/data/TRLT3-70046.json')
let jsonData = JSON.parse(rawData)

let config = getConfig({
  in: 'src/app.js',
  out: 'public',
  clearBeforeBuild: '!(data|img)',
  html (context) {
    let rendered = ReactDOMServer.renderToString(React.createElement(App, { data: jsonData }))
    let template = context.defaultTemplate({
      title: 'CLG vs SKT Game 1 Analysis',
      html: `<div id="root">${rendered}</div>`
    })
    return {
      '200.html': template
    }
  }
})

module.exports = config
