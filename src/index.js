const Promise = require('./promise')
const then = require('./then')

Promise.prototype.then = function (onfulfilled, onrejected) {
  return then.call(this, onfulfilled, onrejected)
}
Promise.prototype.catch = function (onrejected) {
  return then.call(this, null, onrejected)
}

module.exports = Promise
