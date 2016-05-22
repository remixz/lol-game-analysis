require('babel-core/register')

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
    let title = 'League Interactive Timeline'
    let head = '<link rel="dns-prefetch" href="https://timeline-cdn.bruggie.com/"><link rel="dns-prefetch" href="https://ddragon.leagueoflegends.com/">'
    function generateHtml (view) {
      return `<div id="root">${ReactDOMServer.renderToString(React.createElement(App, {}, React.createElement(view)))}</div>`
    }

    return {
      'index.html': context.defaultTemplate({
        title, head,
        html: generateHtml(Index)

      }),
      '200.html': context.defaultTemplate({
        title, head,
        html: generateHtml(Match)
      })
    }
  }
})

module.exports = config
