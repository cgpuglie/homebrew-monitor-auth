const express = require('express');
const morgan = require('morgan')
const { json: jsonParser } = require('body-parser-json')

const {
	SERVICE_BIND_IP='0.0.0.0',
	SERVICE_PORT=8081,
	SERVICE_ROOT='/',
	
	BREW_MASTER='admin',
	BREW_MASTER_PASS='password'
} = process.env

const app = express()

app.use(morgan('tiny'))
app.use(jsonParser())

// set base root
app.all(SERVICE_ROOT)
// set health check route
app.get(
	'/',
	function health (req, res) {
		return res.send({
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

  console.log(`Homebrew-monitor-auth listening at http://${address}:${port}`);
});
