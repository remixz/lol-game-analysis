const getConfig = require('hjs-webpack')

let config = getConfig({
  in: 'src/app.js',
  out: 'public',
  html (context) {
    let template = context.defaultTemplate({
      title: 'CLG vs SKT Game 1 Analysis'
    })
    return {
      'index.html': template
    }
  }
})

module.exports = config
