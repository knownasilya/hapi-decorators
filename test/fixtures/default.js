var web = require('../../')
var controller = web.controller
var route = web.route
var cache = web.cache
var config = web.config
var validate = web.validate

@controller('/check')
class Check {
  @route('get', '/in')
  @validate({ payload: true })
  checkIn (request, reply) {
    // intentionally empty
  }

  @route('get', '/out')
  @config({ test: 'hello' })
  checkOut (request, reply) {

  }

  @route('get', '/')
  @cache({ privacy: 'public' })
  listAll (request, reply) {

  }
}

module.exports = Check
