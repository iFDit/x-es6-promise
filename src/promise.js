const util = require('./util')
const then = require('./then')

const isObject = util.isObject
const isFunction = util.isFcuntion

class Promise {
  constructor(fn) {
    this.value = void 0
    this.state = 'pendding'
    this.fulfilledcallList = []
    this.rejectedcallList = []
    this.init(fn)

    return { then: this.then, catch: this.catch }
  }

  init = (fn) => {
    try {
      fn(this.resolve, this.reject)
    } catch (e) {
      if (this.getState() === 'pendding') {
        this.reject(e)
      }
    }
  }

  then = (onfulfilled, onrejected) => {
    then.call(this, onfulfilled, onrejected)
  }

  catch = (onrejected) => {
    then.call(this, null, onrejected)
  }

  getState = () => {
    return this.state
  }

  getValue = () => {
    return this.value
  }

  resolve = (value) => {
    const then = value.then

    if (isFunction(then)) {
      return then.call(value, this.resolve, this.reject)
    }

    this.fulfilledcallList.forEach((cb, index) => {
      const rejectedHandle = this.rejectedcallList[index]
      const toReject = rejectedHandle ? rejectedHandle.reject : null
      const toResolve = cb.resolve

      try {
        const onfulfilled = cb.onfulfilled
        this.handleValue(onfulfilled(value), toResolve, toReject)
      } catch (e) {
        toReject(e)
      }
    })

    this.setState('resolved')
  }

  reject = (value) => {
    const then = value.then
    
    if (isFunction(then)) {
      return then.call(value, this.resolve, this.reject)
    }

    this.rejectedcallList.forEach((cb, index) => {
      const resolveHandle = this.fulfilledcallList[index]
      const toResolve = resolveHandle ? resolveHandle.resolve : null
      const toReject = cb.reject

      try {
        const onrejected = cb.onrejected
        this.handleValue(onrejected(value), toResolve, toReject)
      } catch (e) {
        toReject(e)
      }
    })

    this.setState('rejected')
  }

  handleValue = (object, resolve, reject) => {
    if (isObject(object) || isFunction(object)) {
      const thenable = object.then
      isFunction(thenable)
        ? thenable.call(object, resolve, reject)
        : resolve(object)
    }
  }

  setState = (state) => {
    this.state = state
    this.fulfilledcallList = []
    this.rejectedcallList = []
  }

  addPendding = (
    fulfilledHandle,
    rejectedHandle
  ) => {
    this.fulfilledcallList.push(fulfilledHandle)
    this.rejectedcallList.push(rejectedHandle)
  }
}