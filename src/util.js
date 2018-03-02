
/**
 * return an check function that check type by pass first argument.
 * 
 * @param {string} type  - check type.
 * @return {function}    - type check function.
 *  
 */
const isType = (type) => (value) => (
  new RegExp(type, 'i').test(Object.prototype.toString.call(value).slice(8, -1))
)

const isFunction = isType('function')
const isObject = isType('object')
const isArray = isType('array')

module.exports = {
  isFunction,
  isObject,
  isArray,
}
