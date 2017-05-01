const should = require('should')
const rp = require('request-promise')

// start app server
const { service, config: {port, root, master: username, pass: password} } = require('../index')
const base = `http://localhost:${port}${root}`

// state object enclosing properties to override test closures
let state = {}
// set property, can be passed to promise.then
const setProp = (name) =>
  (input) => {
    state[name] = input
    return input
  }
// function wrapper to delay evaluation
const getProp = (name) => state[name]

describe('Server', function server() {
  it('should start', function startServer() {    
    service
    .should.eventually.not.equal(undefined)
  })
})

describe('Health', function describeHealth() {
  // test status code
  it('should return a 200 status code', function healthStatusCode () {
    return rp({
      uri: `${base}/health`,
      resolveWithFullResponse: true
    })
    .then(res => res.statusCode)
    .should.eventually.equal(200)
    
  })
})

describe('Auth & jwt creation', function describeLogin() {
  it('should return a jwt for the admin user', function login () {
    return rp({
      uri: `${base}/`,
      method: 'POST',
      json: {username, password}
    })
    .then(body => body.token)
    .then(setProp('jwt'))
    .should.eventually.not.equal(undefined)
  })

  it('should return a 401 for an invalid user', function invalidLogin() {
    return rp({
      uri: `${base}/`,
      method: 'POST',
      json: {username, password},
      resolveWithFullResponse: true
    })
    .then(res => res.statusCode)
    .should.eventually.equal(401)
  })

})

describe('Validation', function describeValidation() {
  it('should validate a token', function tokenValidate () {
    return rp({
      uri: `${base}/verify`,
      method: 'POST',
      json: { token: getProp('jwt') }
    })
    .then(body => body.user)
    .should.eventually.equal(username)
  })
})