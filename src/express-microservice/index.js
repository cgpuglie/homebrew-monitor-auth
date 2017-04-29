const express = require('express')
const morgan = require('morgan')
const chalk = require('chalk')
const { json: jsonParser } = require('body-parser-json')


const base = express()

// create base microservice routes and middlewares
// start webserver
module.exports = function microservice(app, {
  name,
  format,
  ip='0.0.0.0',
  port=8081,
  root=`${name}`,
  color=false
}) {
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

  // set 404 route
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
  base.use(root, app)
  // start server
  return new Promise(function startServer(resolve) {
    const server = base.listen(port, ip, () => {
      const {address, port} = server.address()

      console.log(`${!color ? name : chalk[color](name) } > listening at http://${address}:${port}${root}`)
      return resolve(server, {name, format, ip, port, root, color})
    })
  })
}