const should = require('should')
const rp = require('request-promise')

// start app server
const { service, config: {port, root} } = require('../index')
const base = `http://localhost:${port}${root}`

describe('server', function server() {
  it('Should start', function startServer() {    
    service
    .should.eventually.not.equal(undefined)
  })
})

describe('/health', function describeHealth() {
  // test status code
  it('Should return a 200 status code', function healthStatusCode () {
    return rp({
      uri: `${base}/health`,
      resolveWithFullResponse: true
    })
    .then(res => res.statusCode)
    .should.eventually.equal(200)
    
  })
})