var web = require('../../')

@web.controller('/check')
class Check {
  @web.route('get', '/in')
  @web.validate({ payload: true })
  checkIn(request, reply) {
    // intentionally empty
  }

  @web.route('get', '/out')
  @web.config({ test: 'hello' })
  checkOut(request, reply) {
  
  }
}

module.exports = Check
