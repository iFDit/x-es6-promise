const util = require('./util')

const hasThen = util.hasThen
const getThen = util.getThen
const createId = util.createId
const isObject = util.isObject
const isFunction = util.isFunction

// Promise/A+
class Promise {

  constructor(fn, id) {
    // promise inner property.
    // use to indicate same promise(fixed 2.3.2 bug)
    this.promiseId = id || createId(Math.random() * 1000)
    this.value = void 0
    this.state = 'pendding'
    this.asyncThenPending = false
    this.fulfilledcallList = []
    this.rejectedcallList = []
    // method bind
    this.resolve = this.resolve.bind(this)
    this.reject = this.reject.bind(this)
    this.then = this.then.bind(this)
    this.catch = this.catch.bind(this)
    this.handleValue = this.handleValue.bind(this)
    this.resolveSync = this.resolveSync.bind(this)
    this.rejectSync = this.rejectSync.bind(this)

    // init promise call
    this.init(fn)
    // return other promise instance 
    return { then: this.then, catch: this.catch, promiseId: this.promiseId }
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
    if (this.getState() !== 'pendding' || this.asyncThenPending) { return }
    // safe get then property.
    try {
      const then = hasThen(value) && getThen(value)
      if (isFunction(then)) {
        this.asyncThenPending = true
        // Promise/A+ 2.3.3.3.1 `thenable that tries to fulfill twice for an asynchronously-fulfilled custom thenable`
        const resolveFn = (value) => {
          this.asyncThenPending = false
          this.resolveSync(value)
        }
        const rejectFn = (reason) => {
          this.asyncThenPending = false
          this.rejectSync(reason)
        }
        return then.call(value, resolveFn, rejectFn)
      }
    } catch (err) {
      // handle Promise/A+ 2.3.3.1
      this.rejectSync(err)
    }

    while (this.fulfilledcallList.length > 0) {
      const cb = this.fulfilledcallList.shift()
      const rejectedHandle = this.rejectedcallList.shift()
      const toReject = rejectedHandle ? rejectedHandle.reject : null
      const toResolve = cb.resolve

      try {
        const onfulfilled = cb.onfulfilled
        // if have not onfulfilled callback, then pass value to next promise.
        if (!isFunction(onfulfilled)) { toResolve(value) }
        this.handleValue(onfulfilled(value), toResolve, toReject)
      } catch (e) {
        toReject(e)
      }
    }

    this.setState('resolved', value)
  }

  rejectSync(value, status) {
    if (this.getState() !== 'pendding' || this.asyncThenPending) { return }

    while (this.rejectedcallList.length > 0) {
      const cb = this.rejectedcallList.shift()
      const resolveHandle = this.fulfilledcallList.shift()
      const toResolve = resolveHandle ? resolveHandle.resolve : null
      const toReject = cb.reject

      try {
        const onrejected = cb.onrejected
        // if have not onrejected callback, then pass throght to next promise.
        if (!isFunction(onrejected)) { throw value }
        this.handleValue(onrejected(value), toResolve, toReject)
      } catch (e) {
        toReject(e)
      }
    }

    this.setState('rejected', value)
  }

  handleValue(object, resolve, reject) {
    if (isObject(object) || isFunction(object)) {
      // handle Promise/A+ 2.3.1
      if(object.promiseId === this.promiseId) {
        throw new TypeError('same object error')
      }

      // fixed Promise/A+ 
      const thenable = hasThen(object) && getThen(object)
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
