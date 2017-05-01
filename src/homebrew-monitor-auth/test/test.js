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

describe('login', function describeLogin() {
  it('Should return a json webtoken', function tokenCheck () {
    return rp({
      uri: `${base}/`,
      method: 'POST',
      json: {username, password}
    })
    .then(body => body.token)
    .then(setProp('jwt'))
    .should.eventually.not.equal(undefined)
  })

  it('Should validate a token', function tokenValidate () {
    return rp({
      uri: `${base}/verify`,
      method: 'POST',
      json: { token: getProp('jwt') }
    })
    .then(body => body.user)
    .should.eventually.equal(username)
  })
})