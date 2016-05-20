const getConfig = require('hjs-webpack')

let config = getConfig({
  in: 'src/app.js',
  out: 'public',
  html (context) {
    let template = context.defaultTemplate({
      title: 'League of Legends Interactive Timeline'
    })
    return {
      'index.html': template
    }
  }
})

module.exports = config
