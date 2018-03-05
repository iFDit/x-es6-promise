const Mocha = require('mocha')
const path = require('path')

const mocha = new Mocha({ timeout: 200 })

mocha.addFile(path.resolve(__dirname, 'util.test.js'))

mocha.run(function (failures) {
  if (failures > 0) {
    console.log(failures)
  }
})
