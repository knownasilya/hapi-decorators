'use strict'

var extend = require('extend')
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

exports.controller = function controller (baseUrl, optionsKey = 'config') {
  debug(`@controller setup`)
  return function (target) {
    target.prototype.baseUrl = baseUrl
    target.prototype.optionsKey = optionsKey

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
        hapiRoute[optionsKey] = hapiRoute.settings
        hapiRoute[optionsKey].bind = self

        return hapiRoute
      })
    }
  }
}

exports.cntrlr = function (baseUrl) {
  return exports.controller(baseUrl, 'options')
}

function route (method, path) {
  debug('@route (or alias) setup')
  return function (target, key, descriptor) {
    var targetName = target.constructor.name
    var routeId = targetName + '.' + key

    setRoute(target, key, {
      method: method,
      path: path,
      settings: {
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
  debug('@options or @config setup')
  return function (target, key, descriptor) {
    setRoute(target, key, {
      settings: options
    })

    return descriptor
  }
}

exports.options = options
exports.config = options

function validate (config) {
  debug('@validate setup')
  return function (target, key, descriptor) {
    setRoute(target, key, {
      settings: {
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
      settings: {
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
      settings: {
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
    settings: {
      id: routeId
    }
  }
  var found = target.rawRoutes.find(r => r.settings.id === routeId)

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
