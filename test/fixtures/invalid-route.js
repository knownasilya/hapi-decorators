var web = require('../../')

@web.controller('/check')
class Check {
  @web.validate({ payload: true })
  checkIn(request, reply) {
    // intentionally empty
  }

  @web.config({ test: 'hello' })
  checkOut(request, reply) {
    // intentionally empty
  }
}

module.exports = Check
