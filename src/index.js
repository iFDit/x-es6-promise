// TO DO
const Promise = require('./promise')

const a = new Promise((resolve, reject) => {
  setTimeout(() => resolve(11111), 1000)
})
.then((data) => console.log('first', data))
.then((data) => console.log('second', data))