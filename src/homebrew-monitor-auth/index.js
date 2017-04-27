const express = require('express');
const { json: jsonParser } = require('body-parser-json')

const {
	AUTH_BIND_IP='0.0.0.0',
	AUTH_PORT=8081,
	AUTH_ROOT='/',
	BREW_MASTER='admin',
	BREW_MASTER_PASS='password'
} = process.env

const app = express()

app.use(jsonParser)

// set base root
app.all(AUTH_ROOT)
// set health check route
app.get(
	'/',
	function authenticate (req, res) {
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

const server = app.listen(AUTH_PORT, AUTH_BIND_IP, () => {
  const {address, port} = server.address();

  console.log(`Homebrew-monitor-auth listening at http://${address}:${port}`);
});
