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
        html, head
      }
    }

    const indexView = generateHtml(Index)
    const matchView = generateHtml(Match)
    return {
      'index.html': context.defaultTemplate({
        head: `${indexView.head.title.toString()}${indexView.head.link.toString()}`,
        html: indexView.html
      }),
      '200.html': context.defaultTemplate({
        head: `${matchView.head.title.toString()}${matchView.head.link.toString()}`,
        html: matchView.html
      })
    }
  }
})

module.exports = config
