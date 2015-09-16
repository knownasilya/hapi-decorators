'use strict'

var extend = require('extend')
var find = require('lodash.find')
var routeMethods = {
  get: 'get',
  post: 'post',
  put: 'put',
  delete: 'delete',
  patch: 'patch',
  all: '*'
}

exports.controller = function controller (baseUrl) {
  return function (target) {
    target.prototype.baseUrl = baseUrl

    target.prototype.routes = function () {
      var self = this
      var base = trimslash(this.baseUrl)

      if (!this.rawRoutes) {
        return []
      }

      return this.rawRoutes.map(function (route) {
        if (!route.path) {
          throw new Error('Route path must be set with `@route` or another alias')
        }

        var url = (base + trimslash(route.path)) || '/'

        route.path = url
        route.config.bind = self

        return route
      })
    }
  }
}

function route (method, path) {
  return function (target, key, descriptor) {
    var targetName = target.constructor.name
    var routeId = targetName + '.' + key

    setRoute(target, key, {
      method: method,
      path: path,
      config: {
        id: routeId
      },
      handler: descriptor.value
    })

    return descriptor
  }
}

exports.route = route

// Export route aliases
Object.keys(routeMethods).forEach(function (key) {
  exports[key] = route.bind(null, routeMethods[key])
})

function config (config) {
  return function (target, key, descriptor) {
    setRoute(target, key, {
      config: config
    })

    return descriptor
  }
}

exports.config = config

function validate (config) {
  return function (target, key, descriptor) {
    setRoute(target, key, {
      config: {
        validate: config
      }
    })

    return descriptor
  }
}

exports.validate = validate

function cache (cacheConfig) {
  return function (target, key, descriptor) {
    setRoute(target, key, {
      config: {
        cache: cacheConfig
      }
    })

    return descriptor
  }
}

exports.cache = cache

function setRoute (target, key, value) {
  if (!target.rawRoutes) {
    target.rawRoutes = []
  }

  var targetName = target.constructor.name
  var routeId = targetName + '.' + key
  var defaultRoute = {
    config: {
      id: routeId
    }
  }
  var found = find(target.rawRoutes, 'config.id', routeId)

  if (found) {
    extend(true, found, value)
  } else {
    target.rawRoutes.push(extend(true, defaultRoute, value))
  }
}

function trimslash (s) {
  return s[s.length - 1] === '/'
    ? s.slice(0, s.length - 1)
    : s
}
