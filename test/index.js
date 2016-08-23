'use strict'

var test = require('tape')
var NoRoutes = require('./fixtures/no-routes')
var Default = require('./fixtures/default')
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

test('instance generates routes array', function (t) {
  let instance = new Default()
  let results = instance.routes()

  t.ok(Array.isArray(results), 'results is an array')
  t.equal(results.length, 3, 'Has right number of routes')

  let first = results[0]

  t.equal(first.method, 'get', 'method is get')
  t.equal(first.path, '/check/in', 'path is merged with controller path')
  t.equal(typeof first.handler, 'function', 'handler is a function')
  t.end()
})

test('route paths remain valid after repeated calls to `routes()` method', function (t) {
  let instance = new Default()
  instance.routes()
  instance.routes()
  let results3 = instance.routes()

  let first = results3[0]

  t.equal(first.path, '/check/in', 'path remains valid')
  t.end()
})

test('validate sets up config correctly', function (t) {
  let instance = new Default()
  let results = instance.routes()
  let first = results[0]

  t.same(first.config, { id: 'Check.checkIn', bind: instance, validate: { payload: true } }, 'validate config is valid')
  t.end()
})

test('cache sets up config correctly', function (t) {
  let instance = new Default()
  let results = instance.routes()
  let route = results[2]

  t.same(route.config.cache, { privacy: 'public' }, 'cache config is valid')
  t.end()
})

test('config sets up config correctly', function (t) {
  let instance = new Default()
  let results = instance.routes()
  let second = results[1]

  t.same(second.config, { id: 'Check.checkOut', bind: instance, test: 'hello' }, 'Config is valid')
  t.end()
})

test('invalid setup with no routes', function (t) {
  let instance = new Invalid()

  t.throws(function () {
    instance.routes()
  }, /Route path must be set/)
  t.end()
})
