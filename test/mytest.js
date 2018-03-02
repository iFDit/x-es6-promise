const adapter = require('./test-adapter')

adapter.resolved = function (value) {
  var d = adapter.deferred();
  d.resolve(value);
  return d.promise;
}

adapter.rejected = function (reason) {
  var d = adapter.deferred();
  d.reject(reason);
  return d.promise;
}

var resolved = adapter.resolved
var rejected = adapter.rejected

var promise = resolved()
var firstOnFulfilledFinished = false

promise.then(function () {
  console.log(1234)
  promise.then(function () {
    console.log(firstOnFulfilledFinished)
  })
  firstOnFulfilledFinished = true
});

