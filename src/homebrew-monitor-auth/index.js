const express = require('express')
const morgan = require('morgan')
const chalk = require('chalk')
const yaml = require('js-yaml')
const fs = require('fs')
const path = require('path')
const { json: jsonParser } = require('body-parser-json')

// load ENV
const {
	SERVICE_BIND_IP='0.0.0.0',
	SERVICE_PORT=8081,
	SERVICE_ROOT='/',
	SERVICE_COLOR=true,
	
	BREW_MASTER='admin',
	BREW_MASTER_PASS='password'
} = process.env

// load service config
const {
	name='service',
	color,
} = yaml.safeLoad(fs.readFileSync(path.join(__dirname, 'config.yml')))

const app = express()

app.use(morgan(`${ !color ? name : chalk[color](name)} > :method :status :url - :response-time ms`))
app.use(jsonParser())

// set base root
app.all(SERVICE_ROOT)
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
	function authenticate ({body: { username = '', password = '' }}, res) {
		return username === BREW_MASTER
		&& password === BREW_MASTER_PASS
		? res.send(200)
		: res.send(401)
	}
)

const server = app.listen(SERVICE_PORT, SERVICE_BIND_IP, () => {
  const {address, port} = server.address();

  console.log(`${!color ? name : chalk[color](name) } > listening at http://${address}:${port}`);
});
