const express = require('express')
const yaml = require('js-yaml')
const fs = require('fs')
const path = require('path')
// TODO: Move this to an npm module
const microservice = require('../express-microservice')
// load service config
const {
	name='service',
	serviceColor=false,
	serviceBindIp='0.0.0.0',
	servicePort=8081,
	serviceRoot=`/${name}`,
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
	BREW_MASTER:master='admin',
	BREW_MASTER_PASS:pass='password'
} = process.env

const app = express()

// provide authentication
// TODO: use JWT
app.post(
	'/', 
	function authenticate ({body: { username = '', password = '' }}, res, next) {
		return username === master
		&& password === pass
		? res.status(200).send()
		: next({code: 401, err: new Error("Not Authorized")})
	}
)

// start microservice
microservice(
	app,
	{
		name,
		format,
		ip,
		port,
		root,
		color
	}
)
