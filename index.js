'use strict'

var extend = require('extend')
var find = require('lodash.find')
var debug = require('debug')('hapi-decorators')
var routeMethods = {
  get: 'get',
  post: 'post',
  put: 'put',
  delete: 'delete',
  del: 'delete',
  patch: 'patch',
  all: '*'
}

exports.controller = function controller (baseUrl) {
  return function (target) {
    target.prototype.baseUrl = baseUrl

    target.prototype.routes = function () {
      var self = this
      var base = trimslash(this.baseUrl)

      debug('Pre-trim baseUrl: %s', this.baseUrl)
      debug('Post-trim baseUrl: %s', base)

      if (!this.rawRoutes) {
        return []
      }

      return this.rawRoutes.map(function (route) {
        if (!route.path) {
          throw new Error('Route path must be set with `@route` or another alias')
        }

        debug('Route path before merge with baseUrl: %s', route.path)
        var url = (base + trimslash(route.path)) || '/'

        var hapiRoute = extend({}, route)

        hapiRoute.path = url
        hapiRoute.config.bind = self

        return hapiRoute
      })
    }
  }
}

function route (method, path) {
  debug('@route (or alias) setup')
  return function (target, key, descriptor) {
    var targetName = target.constructor.name
    var routeId = targetName + '.' + key

    setRoute(target, key, {
      method: method,
      path: path,
      options: {
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

function options (options) {
  debug('@options setup')
  return function (target, key, descriptor) {
    setRoute(target, key, {
      options: options
    })

    return descriptor
  }
}

exports.config = config

function validate (config) {
  debug('@validate setup')
  return function (target, key, descriptor) {
    setRoute(target, key, {
      options: {
        validate: config
      }
    })

    return descriptor
  }
}

exports.validate = validate

function cache (cacheConfig) {
  debug('@cache setup')
  return function (target, key, descriptor) {
    setRoute(target, key, {
      options: {
        cache: cacheConfig
      }
    })

    return descriptor
  }
}

exports.cache = cache

function pre (pre) {
  debug('@pre setup')
  return function (target, key, descriptor) {
    if (typeof pre === 'string') {
      pre = [{ method: target.middleware[pre] }]
    } else if (!Array.isArray(pre)) {
      pre = [pre]
    }

    setRoute(target, key, {
      options: {
        pre: pre
      }
    })

    return descriptor
  }
}

exports.pre = pre

function middleware () {
  return function (target, key, descriptor) {
    if (!target.middleware) {
      target.middleware = {}
    }

    target.middleware[key] = descriptor.value

    return descriptor
  }
}

exports.middleware = middleware

function setRoute (target, key, value) {
  if (!target.rawRoutes) {
    target.rawRoutes = []
  }

  var targetName = target.constructor.name
  var routeId = targetName + '.' + key
  var defaultRoute = {
    options: {
      id: routeId
    }
  }
  var found = find(target.rawRoutes, 'config.id', routeId)

  if (found) {
    debug('Subsequent configuration of route object for: %s', routeId)
    extend(true, found, value)
  } else {
    debug('Initial setup of route object for: %s', routeId)
    target.rawRoutes.push(extend(true, defaultRoute, value))
  }
}

function trimslash (s) {
  return s[s.length - 1] === '/'
    ? s.slice(0, s.length - 1)
    : s
}
