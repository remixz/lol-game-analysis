const _ = require('lodash')
const fs = require('fs')
const fileExists = require('file-exists')

fs.readdir(`${process.cwd()}/finished/`, (err, files) => {
  files = files.filter(file => (file.indexOf('.json') > -1))
  files.forEach((file) => {
    let path = `${process.cwd()}/finished/${file}`
    let data = require(path)

    let mergedPath = `${process.cwd()}/merged/${data.id.replace(/\|/g, '-')}.json`
    if (fileExists(mergedPath)) {
      console.log(mergedPath + ' already exists - skipping')
      return
    }
    const stream = fs.createWriteStream(mergedPath)
    stream.write('[\n')

    console.log(`merging ${data.events.length} events for game ${data.id}`)
    let last = {}
    data.events.forEach((obj, i) => {
      if (i === 0) {
        last = obj
        return stream.write(JSON.stringify(obj) + ',\n')
      }
      last = _.merge(last, obj)
      stream.write(JSON.stringify(last) + (i === data.events.length - 1 ? '\n' : ',\n'))
    })
    stream.write(']\n')
    stream.end()
  })
})
