const express = require('express')
const morgan = require('morgan')
const chalk = require('chalk')
const yaml = require('js-yaml')
const fs = require('fs')
const path = require('path')
const { json: jsonParser } = require('body-parser-json')

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
	SERVICE_BIND_IP=serviceBindIp,
	SERVICE_PORT=servicePort,
	SERVICE_ROOT = serviceRoot,
	SERVICE_COLOR: color = serviceColor,
	BREW_MASTER='admin',
	BREW_MASTER_PASS='password'
} = process.env

const base = express()
const app = express()

app.use(morgan(`${ !color ? name : chalk[color](name)} > ${format}`))
app.use(jsonParser())

// set health check route
app.get(
	'/health',
	function health (req, res) {
		return res
			.status(200)
			.send({
				ok: true
			})
	}
)
app.post(
	'/', 
	function authenticate ({body: { username = '', password = '' }}, res, next) {
		return username === BREW_MASTER
		&& password === BREW_MASTER_PASS
		? res.status(200).send()
		: next({code: 401, err: new Error("Not Authorized")})
	}
)

app.use(function notFound(req, res, next) {
	return next({code: 404, err: new Error("Not Found")})
})

app.use(function error({code=500, err=new Error()}, req, res, next) {
	return code >= 500
		? console.log(`${!color ? name : chalk[color](name) } > `, err) // log error and stack trace above 500
		: console.log(`${!color ? name : chalk[color](name) } > ${err.message}`) // log only message - cleaner
	|| res.status(code).send({message: err.message})
})

// set base route
base.use(SERVICE_ROOT, app)

const server = base.listen(SERVICE_PORT, SERVICE_BIND_IP, () => {
  const {address, port} = server.address();

  console.log(`${!color ? name : chalk[color](name) } > listening at http://${address}:${port}${SERVICE_ROOT}`);
});
