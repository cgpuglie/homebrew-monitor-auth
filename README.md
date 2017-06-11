# Homebrew Monitor - Authentication

Authentication microservice for Homebrew Monitor

### Development

This service is developed primarily with TDD, using Mocha tests and Nock to simulate interactions with other services. This can be done using Docker or running locally with node.

Build and run the docker test image
```bash
$ npm run docker-build-test;
$ npm run docker-run-test;
```

The service runs alongside various other services. The deployment information is a part of [the parent repo](https://github.com/cgpuglie/homebrew-monitor).

For development of dependencies like homebrew-monitor-common, you can mount dependencies as volumes as follows:

```bash
docker run \
  -it --rm \
  -v /home/cpuglies/projects/homebrew-monitor-common/:/usr/src/homebrew-monitor-rest/node_modules/homebrew-monitor-common/ \
  homebrew-monitor-rest-test
```

### Routes

TODO: Document these :)

### Config

This service can be configured fully through the *config.yml* file in the project root, or through environment variables.  
*Environment variables take precedence over values set in config*

Below is a list of configuration options.

| config.yml    | env variable      | default     |
|---            |---                |---          |
|name           |                   |'service'    |
|serviceEnv     |NODE_ENV           |'Production' |
|serviceColor   |SERVICE_COLOR      |false        |
|serviceBindIp  |SERVICE_BIND_IP    |'0.0.0.0'    |
|servicePort    |SERVICE_PORT       |8082         |
|serviceRoot    |SERVICE_ROOT       |`/${name}`   |
|secret         |SERVICE_SECRET     |'J50NW3bT0k3n'  |
|lifetime       |TOKEN_LIFETIME_H   |1            |
|master         |BREW_MASTER        |'admin'      |
|BREW_MASTER_PASS|pass              |'password'   |
