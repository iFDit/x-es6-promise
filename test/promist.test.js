const Promise = require('../src')

setTimeout(() => console.log(22222), 0)

const a = new Promise((resolve, reject) => {
  resolve(11111)
})
.then((data) => console.log('first', data))
.then((data) => console.log('second', data))
.then(() => { throw 'test'})
.catch((err) => console.log(err))
.then(() => 1234)
.then((data) => console.log('final', data))
.then(() => new Promise((r, j) => setTimeout(() => r(100), 6000)))
.then((data) => console.log('wait for 6s', data))
