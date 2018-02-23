const Promise = require('./promise')
const util = require('./util')
const isfunction = util.isfunction
const isObject = util.isObject
/**
 * Provide Promise/A+ then implement.
 * 
 * @param {function} onfulfilled  - when promise state is fulfilled, call this function with value.
 * @param {function} onrejected   - when promise state is rejected, call this function with reason.
 * @returns {promise}
 */
function then(onfulfilled, onrejected) {
  let returnValue = void 0
  // get promise from this (ps: promise.then()).
  const promise = this
  const state = promise.getState()
  const hasCall = promise.getCallFlags()
  // if promise state is fulfilled, value is eventual result.
  // if promise state is rejected, value is rejected reason.
  const value = promise.getValue()

  if (state === 'pendding') {
    return new Promise((resolve, reject) => 
      promise.addPendding(
        {onfulfilled, resolve},
        {onrejected, reject},
      )
    )
  }

  if (!hasCall) {
    try {
      const isFulfilled = state === 'fulfilled'
      const isRejected = state === 'rejected'
      const callFn = isFulfilled
        ? onfulfilled
        : isRejected ? onrejected : null

      returnValue = isfunction(callFn)
        ? callFn(value)
        : isFulfilled ? Promise.resolve(value)
        : isRejected ? Promise.reject(value)
        : value
      
      if (returnValue instanceof Promise) {
        return returnValue
      }

      if (isObject(returnValue) || isfunction(returnValue)) {
        const thenable = returnValue.then
        return isfunction(thenable)
          ? new Promise((resolve, reject) =>
            thenable.call(returnValue, resolve, reject))
          : Promise.resolve(returnValue)
      }

      return Promise.resolve(returnValue)
    } catch(e) {
      // if error occur, then return next promise with rejected state.
      return Promise.reject(e)
    }
  }
}
