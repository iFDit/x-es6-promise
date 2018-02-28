const Promise = require('./promise')
const util = require('./util')

const isArray = util.isArray
const isObject = util.isObject
const isFunction = util.isFunction

function all() {
  const arg1 = arguments[0]

  return new Promise((resolve, reject) => {
    if(!isArray(arg1)) { throw new TypeError('undefined is not a function') }

    let count = arg1.length
    const result = new Array(count)

    const done = (index) => (value) => {
      result[index] = value
      count -= 1
    }

    arg1.forEach((value, index) => {
      if (isObject(value) || isFunction(value)) {
        const thenable = value.then
        isFunction(thenable)
          ? thenable.call(value, done(index), reject)
          : done(index)(value)
      } else {
        done(index)(value)
      }
    })
  })
}
