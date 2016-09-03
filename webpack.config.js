const getConfig = require('hjs-webpack')

let config = getConfig({
  in: 'src/app.js',
  out: 'public'
})

module.exports = config
