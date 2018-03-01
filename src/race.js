const Promise = require('./promise')
const util = require('./util')

function race() {
  const arg1 = arguments[0]

  return new Promise((resolve, reject) => {
    if(!isArray(arg1)) { throw new TypeError('undefined is not a function') }

    arg1.forEach((value) => {
      if (isObject(value) || isFunction(value)) {
        const thenable = value.then
        isFunction(thenable)
          ? thenable.call(value, resolve, reject)
          : resolve(value)
      } else {
        resolve(value)
      }
    })
  })
}

module.exports = race
