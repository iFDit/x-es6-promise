const util = require('./util')

const isObject = util.isObject
const isFunction = util.isFunction

// Promise A+
class Promise {

  constructor(fn) {
    // promise inner property.
    this.value = void 0
    this.state = 'pendding'
    this.fulfilledcallList = []
    this.rejectedcallList = []
    // method bind
    this.resolve = this.resolve.bind(this)
    this.reject = this.reject.bind(this)
    this.then = this.then.bind(this)
    this.catch = this.catch.bind(this)

    // init promise call
    this.init(fn)
    // return other promise instance 
    return { then: this.then, catch: this.catch }
  }

  init(fn) {
    // immediately call the function.
    try {
      fn(this.resolve, this.reject)
    } catch (e) {
      // if function catch en error and promise state is pendding
      // then reject this promise.
      if (this.getState() === 'pendding') {
        this.reject(e)
      }
    }
  }

  then(onfulfilled, onrejected) {
    // overwrite
  }

  catch(onrejected) {
    // overwrite
  }

  resolve(value) {
    const execute = () => this.resolveSync(value)
    // guarantee the promise always run async.
    this.asyncRun(execute)
  }

  reject(value) {
    const execute = () => this.rejectSync(value)
    // guarantee the promise always run async.
    this.asyncRun(execute)
  }

  resolveSync(value) {
    if (this.getState() !== 'pendding') { return }

    const then =  value ? value.then : null

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

    this.setState('resolved', value)
  }

  rejectSync(value) {
    if (this.getState() !== 'pendding') { return }
    
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

    this.setState('rejected', value)
  }

  handleValue(object, resolve, reject) {
    if (isObject(object) || isFunction(object)) {
      const thenable = object.then
      isFunction(thenable)
        ? thenable.call(object, resolve, reject)
        : resolve(object)
    } else {
      // return value is not object or function
      // then just pass value to outer promise.
      resolve(object)
    }
  }

  asyncRun(fn) {
    if (global && global.process && isFunction(process.nextTick)) {
      // push to microtasks.
      process.nextTick(fn)
    } else if (window && isFunction(window.MutationObserver)) {
      // Browser env has MutationObserver that is use microtask.
      const div = window.document.createElement('div')
      const observer = new window.MutationObserver(fn)
      observer.observe(div, {attributes: true})
      div.setAttribute('id', 'id' + new Date().getTime())
    } else {
      // else use macrotask.
      setTimeout(fn, 0)
    }
  }

  setState(state, value) {
    this.state = state
    this.value = value
    this.fulfilledcallList = []
    this.rejectedcallList = []
  }

  addPendding(
    fulfilledHandle,
    rejectedHandle
  ) {
    this.fulfilledcallList.push(fulfilledHandle)
    this.rejectedcallList.push(rejectedHandle)
  }

  getState() {
    return this.state
  }

  getValue() {
    return this.value
  }

}

module.exports = Promise
