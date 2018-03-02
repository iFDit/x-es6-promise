const Promise = require('../src')

module.exports = {
  deferred: function () {
    let resolve = null
    let reject = null
    const promise = new Promise((iresolve, ireject) => {
      resolve = iresolve
      reject = ireject
    })
    return { promise, resolve, reject }
  }
}
