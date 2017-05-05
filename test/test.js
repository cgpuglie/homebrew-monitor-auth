const should = require('should')
const rp = require('request-promise')
const jwt = require('jsonwebtoken')
// set the environment to 'Test' to silence logs
process.env['NODE_ENV'] = 'Test'

// start app server
const { service, config: {port, root, secret, master: username, pass: password} } = require('../index')
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

  it('should respond with 404 errors', function notFound() {
    return rp({
      uri: `${base}/notARealApi`,
      resolveWithFullResponse: true
    })
    .then(res => res.statusCode)
    .catch(res => res.statusCode)
    .should.eventually.equal(404)
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
    .catch(res => res.statusCode)
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
      json: {username: 'BlackBeard', password: 'ImABadPirate'},
      resolveWithFullResponse: true
    })
    .then(res => res.statusCode)
    .catch(res => res.statusCode)
    .should.eventually.equal(401)
  })

})

describe('Validation', function describeValidation() {
  it('should decode a valid token', function tokenValidate () {
    return rp({
      uri: `${base}/decode`,
      method: 'POST',
      json: { token: getProp('jwt') }
    })
    .then(body => body.username)
    .should.eventually.equal(username)
  })

  it('should reject an invalid token', function tokenInvalidate() {
    return rp({
      uri: `${base}/decode`,
      method: 'POST',
      json: { 
        token: jwt.sign({
          username,
          exp: (Math.floor(Date.now() / 1000) + (60 * 60 * 1000)) // not likely to expire
        }, 'notTheRightSecret'), // use incorrect secret
      },
      resolveWithFullResponse: true
    })
    .then(res => res.statusCode)
    .catch(res => res.statusCode)
    .should.eventually.equal(401)
  })

  it('should reject an expired token', function tokenExpired() {
    return rp({
      uri: `${base}/decode`,
      method: 'POST',
      json: { 
        token: jwt.sign({
          username,
          exp: (Math.floor(Date.now() / 1000) - (60 * 60 * 1000)) // long expired
        }, secret),
      },
      resolveWithFullResponse: true
    })
    .then(res => res.statusCode)
    .catch(res => res.statusCode)
    .should.eventually.equal(403)
  })
})