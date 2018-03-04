
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

/**
 * return an property own checker.
 * @param {string} prop  - props that will be check.
 * @return {function}    - property checker.
 * 
 */
const ownPropWith = (prop) => (data) => Object.hasOwnProperty.call(data || {}, prop)

/**
 * create uniq id.
 * @param {*} seed 
 * 
 */
const createId = (seed) => new Date().getTime() + (Math.random() * seed).toFixed(0)

/**
 * return an property getter.
 * @param {string} prop  - props that will be selected.
 * @return {function}    - property getter.
 * 
 */
const get = (prop) => (object) => {
  try {
    return object && object[prop]
  } catch (e) {
    throw e
  }
}

/**
 * return funtions that can be call only once.
 * @param {array} fns  - functions array.
 * @return {array}     - all of functions that can be call once.
 * 
 */
const once = (fns) => {
  let called = false
  const functions = isArray(fns) ? fns : [fns].filter(Boolean)
  return functions.map((fn) => {
    const returnFn = (...args) => {
      if (called) { return }
      called = true
      returnFn.called = true
      fn(...args)
    }
    return returnFn
  })
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
  once,
}
