const fs = require('fs')
// download latest item.json from https://developer.riotgames.com/docs/static-data
const data = require('./item.json').data

const output = {}
Object.keys(data).forEach((key) => {
  output[key] = data[key].name
})

fs.writeFileSync('./items.json', JSON.stringify(output))
