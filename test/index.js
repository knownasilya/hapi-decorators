'use strict'

var test = require('tape')
var NoRoutes = require('./fixtures/no-routes')
var Default = require('./fixtures/default')
var DefaultOptions = require('./fixtures/default-options')
var Invalid = require('./fixtures/invalid-route')

test('instance has routes function', function (t) {
  let instance = new Default()

  t.ok(typeof instance.routes === 'function', 'Has `routes` function')
  t.end()
})

test('instance has no routes', function (t) {
  let instance = new NoRoutes()

  t.same(instance.routes(), [], 'No routes returns empty array')
  t.end()
})

var testClasses = [Default, DefaultOptions]

testClasses.forEach(function (TestClass) {
  test('instance sets options/config correctly', function (t) {
    let instance = new TestClass()
    let results = instance.routes()

    let first = results[0]

    t.ok(first.hasOwnProperty(instance.optionsKey))
    t.end()
  })

  test('instance generates routes array', function (t) {
    let instance = new TestClass()
    let results = instance.routes()

    t.ok(Array.isArray(results), 'results is an array')
    t.equal(results.length, 3, 'Has right number of routes')

    let first = results[0]
    let second = results[1]

    t.equal(first.method, 'get', 'method is get')
    t.equal(first.path, '/check/in', 'path is merged with controller path')
    t.equal(typeof first.handler, 'function', 'handler is a function')
    if (second) {
      t.equal(second[instance.optionsKey].pre.length, 1, 'Has a pre assigned')
    }
    t.end()
  })

  test('route paths remain valid after repeated calls to `routes()` method', function (t) {
    let instance = new TestClass()
    instance.routes()
    instance.routes()
    let results3 = instance.routes()

    let first = results3[0]

    t.equal(first.path, '/check/in', 'path remains valid')
    t.end()
  })

  test('validate sets up options correctly', function (t) {
    let instance = new TestClass()
    let results = instance.routes()
    let first = results[0]

    t.same(first[instance.optionsKey], {
      id: 'Check.checkIn',
      bind: instance,
      validate: {
        payload: true
      }
    }, 'validate options is valid')
    t.end()
  })

  test('cache sets up options correctly', function (t) {
    let instance = new TestClass()
    let results = instance.routes()
    let route = results[2]

    t.ok(route, 'A third route was not found')
    if (route) {
      t.same(route[instance.optionsKey].cache, {
        privacy: 'public'
      }, 'cache options is valid')
    }
    t.end()
  })

  test('options sets up options correctly', function (t) {
    let instance = new TestClass()
    let results = instance.routes()
    let second = results[1]
    t.ok(second, 'A second route was not found')

    if (second) {
      t.equal(second[instance.optionsKey].id, 'Check.checkOut')
      t.equal(second[instance.optionsKey].bind, instance)
      t.equal(second[instance.optionsKey].test, 'hello')
    }
    t.end()
  })
})

test('invalid setup with no routes', function (t) {
  let instance = new Invalid()

  t.throws(function () {
    instance.routes()
  }, /Route path must be set/)
  t.end()
})
