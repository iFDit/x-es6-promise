const assert = require('assert')
const util = require('../src/util')
const sinon = require('sinon')

describe('Util function', function () {
  describe('#isArray', function () {
    const isArray = util.isArray

    it('should return true when the value is Array', function () {
      assert.equal(isArray([1, 2, 3, 4]), true)
    })

    it('should return false when the value is not Array', function () {
      assert.equal(isArray(null), false)
      assert.equal(isArray(1), false)
      assert.equal(isArray('string'), false)
    })

    it('should return false when the value is Array like', function () {
      const arraylike = {
        0: '1',
        2: '2',
        3: '3',
        4: '4',
        length: 4
      }

      assert.equal(isArray(arraylike), false)
    })
  })

  describe('#isObject', function () {
    const isObject = util.isObject

    it('should return true when the value type is origin object', function () {
      assert.equal(isObject({}), true)
    })

    it('should return false when the value type is not origin object', function () {
      assert.equal(isObject(null), false)
      assert.equal(isObject([]), false)
      assert.equal(isObject(function () {}), false)
    })
  })

  describe('#isFunction', function () {
    const isFunction = util.isFunction

    it('should return true when the value type is function', function () {
      assert.equal(isFunction(function () {}), true)
      assert.equal(isFunction(setTimeout), true)
      assert.equal(isFunction(() => {}), true)
      assert.equal(isFunction(Date), true)
      assert.equal(isFunction(Array), true)
      assert.equal(isFunction(Object), true)
    })

    it('should return false when the value type is not function', function () {
      assert.equal(isFunction({}), false)
      assert.equal(isFunction([]), false)
    })
  })

  describe('#hasThen', function () {
    const hasThen = util.hasThen

    const ownThen = {
      then: function () {}
    }

    const protoThen = Object.create(ownThen)

    const notThen = {}

    it('shoul return true when the value has then property itself', function () {
      assert.equal(hasThen(ownThen), true)
    })

    it('should return false when the value has then but from prototype', function () {
      assert.equal(hasThen(protoThen), false)
    })

    it('should return false when the value have not then property', function () {
      assert.equal(hasThen(notThen), false)
    })
  })

  describe('#once', function () {
    const once = util.once
    it('will call the original function', function () {
      const callback = sinon.spy()
      const [proxy] = once(callback)
      proxy()
      assert.equal(callback.called, true)
    })

    it('will only call once', function () {
      const callback1 = sinon.spy()
      const callback2 = sinon.spy()

      const [proxy1, proxy2] = once(callback1, callback2)
      proxy1()
      proxy2()
      
      assert.equal(callback1.called, true)
      assert.equal(callback2.called, false)

    })
  })
})