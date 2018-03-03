
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

const ownPropWith = (prop) => (data) => Object.hasOwnProperty.call(data || {}, prop)
const createId = (seed) => new Date().getTime() + (Math.random() * seed).toFixed(0)
const get = (prop) => (object) => {
  try {
    return object && object[prop]
  } catch (e) {
    throw e
  }
}

const isFunction = isType('function')
const isObject = isType('object')
const isArray = isType('array')
const hasThen = ownPropWith('then')
const getThen = get('then')

module.exports = {
  isFunction,
  isObject,
  isArray,
  hasThen,
  getThen,
  createId,
}
