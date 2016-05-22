require('babel-core/register')

const fs = require('fs')
const getConfig = require('hjs-webpack')
const React = require('react')
const ReactDOMServer = require('react-dom/server')
const App = require('./src/views/app').default
const Index = require('./src/views/index').default
const Match = require('./src/views/match').default

let config = getConfig({
  in: 'src/app.js',
  out: 'public',
  clearBeforeBuild: '!(matches|img)',
  html (context) {
    let title = 'League of Legends Interactive Timeline'
    function generateHtml (view) {
      return `<div id="root">${ReactDOMServer.renderToString(React.createElement(App, {}, React.createElement(view)))}</div>`
    }

    return {
      'index.html': context.defaultTemplate({
        title,
        html: generateHtml(Index)
      }),
      '200.html': context.defaultTemplate({
        title,
        html: generateHtml(Match)
      })
    }
  }
})

module.exports = config
