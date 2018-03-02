const Promise = require('./promise')
const util = require('./util')


/**
 * 
 * Promise race method.
 * accept an promise arry and resovle when first promise is resovle,
 * if any of promise is reject, then Promise.race will become rejcet.
 */
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
