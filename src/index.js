const Promise = require('./promise')
const then = require('./then')
const all = require('./all')
const race = require('./race')

Promise.prototype.then = function (onfulfilled, onrejected) {
  return then.call(this, onfulfilled, onrejected)
}
Promise.prototype.catch = function (onrejected) {
  return then.call(this, null, onrejected)
}

// Static Method
Promise.resolve = (value) => new Promise((resolve) => resolve(value))
Promise.reject = (value) => new Promise((resolve, reject) => reject(value))
Promise.all = all
Promise.race = race

module.exports = Promise
