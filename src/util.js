
const isType = (type) => (value) => (
  new RegExp(type, 'i').test(Object.prototype.toString.call(value).slice(8, -1))
)

const isfunction = isType('function')
const isObject = isType('object')

module.exports = {
  isFunction,
  isObject,
}
