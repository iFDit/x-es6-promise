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

var deferred = adapter.deferred
var resolved = adapter.resolved
var rejected = adapter.rejected

var promise = rejected();

var sentinel = { sentinel: "sentinel" };
var other = { other: "other" };
var dummy = { dummy: "dummy" };

function outer(v) {
  return {
    then: function (onFulfilled) {
        onFulfilled(v);
        onFulfilled(other);
    }
};
}

function inner(v) {
  return {
    then: function (onFulfilled) {
        setTimeout(function () {
            onFulfilled(v);
        }, 0);
    }
};
}

function yFactory() {
  return outer(inner(sentinel))
}

function test(promise) {
  promise.then(function onPromiseFulfilled(value) {
    console.log(value)
      // assert.strictEqual(value, fulfillmentValue);
  }, (err) => console.log(err))
}

function xFactory() {
  return {
      then: function (resolvePromise) {
          resolvePromise(yFactory());
      }
  };
}

var promise = resolved(dummy).then(function onBasePromiseFulfilled() {
  return xFactory();
});

test(promise);