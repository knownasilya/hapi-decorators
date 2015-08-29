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

exports.controller = function controller(baseUrl) {
  return function (target) {
    target.prototype.baseUrl = baseUrl

    target.prototype.routes = function () {
      var base = trimslash(this.baseUrl)

      if (!this.rawRoutes) {
        return;
      }

      return this.rawRoutes.map(function (route) {
        var url = (base + trimslash(route.path)) || '/';

        route.path = url

        return route
      })
    }
  }
}

function route(method, path) {
  return function (target, key, descriptor) {
    setRoute(target, key, {
      method: method,
      path: path,
      config: {
        id: key
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

function setRoute(target, key, value) {
  if (!target.rawRoutes) {
    target.rawRoutes = []
  }

  var found = find(target.rawRoutes, 'config.id', key)

  target.rawRoutes.push(extend(found || {}, value))
}

function trimslash(s) {
  return s[s.length - 1] === '/'
    ? s.slice(0, s.length - 1)
    : s
}
