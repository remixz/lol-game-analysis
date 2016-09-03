require('babel-core/register')

const getConfig = require('hjs-webpack')
const React = require('react')
const ReactDOMServer = require('react-dom/server')
const App = require('./src/views/app').default
const Index = require('./src/views/index').default
const Match = require('./src/views/match').default
const Helmet = require('react-helmet')

let config = getConfig({
  in: 'src/app.js',
  out: 'public',
  clearBeforeBuild: '!(matches|img)',
  html (context) {
    function generateHtml (view) {
      const html = `<div id="root">${ReactDOMServer.renderToString(React.createElement(App, {}, React.createElement(view)))}</div>`
      const head = Helmet.rewind()
      return {
        html,
        head: `${head.title.toString()}${head.link.toString()}`
      }
    }

    return {
      'index.html': context.defaultTemplate(generateHtml(Index)),
      '200.html': context.defaultTemplate(generateHtml(Match))
    }
  }
})

module.exports = config
