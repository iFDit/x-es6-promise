
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
