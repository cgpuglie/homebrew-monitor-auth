const express = require('express')
const yaml = require('js-yaml')
const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken')
const { json: jsonParser } = require('body-parser-json')

// TODO: Move this to an npm module
const microservice = require('../express-microservice')
// load service config
const {
	name='service',
	serviceColor=false,
	serviceBindIp='0.0.0.0',
	servicePort=8081,
	serviceRoot=`/${name}`,
	serviceSecret='J50NW3bT0k3n',
	tokenLifetimeH=1,
	morgan: {
		format
	}
} = yaml.safeLoad(fs.readFileSync(path.join(__dirname, 'config.yml')))

// load ENV
const {
	SERVICE_BIND_IP:ip=serviceBindIp,
	SERVICE_PORT:port=servicePort,
	SERVICE_ROOT:root=serviceRoot,
	SERVICE_COLOR:color=serviceColor,
	
	SERVICE_SECRET:secret=serviceSecret,
	TOKEN_LIFETIME_H:lifetime=tokenLifetimeH,
	
	BREW_MASTER:master='admin',
	BREW_MASTER_PASS:pass='password'
} = process.env

const app = express()

// use body parser
app.use(jsonParser())
// provide authentication
// TODO: use JWT
app.post(
	'/', 
	function authenticate ({body: { username = '', password = '' } = {}}, res, next) {
		return username === master
		&& password === pass
		? res.status(200).send({
			token: jwt.sign({
				username,
				exp: (Math.floor(Date.now() / 1000) + (60 * 60 * tokenLifetimeH)) // Expiration based on hours in config
			}, secret),
		})
		: next({code: 401, err: new Error("Invalid Credentials")})
	}
)

app.post(
	'/decode',
	function decodeToken ({body: { token }}, res, next) {
		jwt.verify(token, secret, function decode(err, decoded) {
			return !err // check for error - means token was invalid
			? res.status(200).send(decoded)
			: next(
				err.name === 'TokenExpiredError'
				? { code: 403, err }
				: { code: 401, err: new Error("Invalid token supplied") }
			)
		})
	}
)

// start microservice
module.exports = {
	service: microservice(app, { name, format, ip, port, root, color }),
	config: { name, format, ip, port, root, color, master, pass, secret, lifetime }
}

