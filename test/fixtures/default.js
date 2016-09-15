'use strict'

const web = require('../../')
const { controller, route, cache, config, validate, pre } = web

@controller('/check')
class Check {
  @route('get', '/in')
  @validate({ payload: true })
  checkIn (request, reply) {
    // intentionally empty
  }

  @route('get', '/out')
  @pre({ method: () => { return 'test' }, assign: 'pre' })
  @config({ test: 'hello' })
  checkOut (request, reply) {

  }

  @route('get', '/')
  @cache({ privacy: 'public' })
  listAll (request, reply) {

  }
}

module.exports = Check
