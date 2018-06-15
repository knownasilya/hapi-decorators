# hapi-decorators

Decorators for HapiJS routes.
Heavily inspired and borrowed from https://github.com/stewartml/express-decorators

Great to mix with https://github.com/jayphelps/core-decorators.js

[![npm version](https://badge.fury.io/js/hapi-decorators.svg)](http://badge.fury.io/js/hapi-decorators)
[![Build Status](https://travis-ci.org/knownasilya/hapi-decorators.svg)](https://travis-ci.org/knownasilya/hapi-decorators)
[![Coverage Status](https://coveralls.io/repos/knownasilya/hapi-decorators/badge.svg?branch=master&service=github)](https://coveralls.io/github/knownasilya/hapi-decorators?branch=master)

## Usage

Prerequisits:

- Hapi 17+ (Use 0.x for Hapi 16 or earlier)
- Node 6+ (Use 0.x for Node 5 or earlier)

```sh
npm install --save hapi-decorators
```

```js
import {
  get,
  controller
} from 'hapi-decorators'
import Hapi from 'hapi'

const server = new Hapi.Server()

server.connection({
  host: 'localhost',
  port: 3000
})

// Define your endpoint controller
@controller('/hello')
class TestController {
  constructor(target) {
    this.target = target
  }

  @get('/world')
  sayHello(request, reply) {
    reply({ message: `hello, ${this.target}` })
  }
}

// InitializeController
let test = new TestController('world')

// Add Test Controller routes to server
server.route(test.routes())

// Start the server
server.start((err) => {
  if (err) throw err
  console.log(`Server running at: ${server.info.uri}`)
})
```

### Setup Babel

Run the above script with the following command, after installing [babel].

```no-highlight
babel-node --optional es7.decorators,es7.objectRestSpread index.js
```

Note: Decorators are currently unsupported in Babel 6. To work around that [issue]
use the [transform-decorators-legacy] plugin. See this [post] for detailed instructions.


## Decorators

### `@controller(basePath)`

**REQUIRED** This decorator is required at the class level, since it processes the other decorators, and adds
the `instance.routes()` function, which returns the routes that can be used with Hapi, e.g. `server.routes(users.routes())`.


### `@route(method, path)`

This decorator should be attached to a method of a class, e.g.

```js
@controller('/users')
class Users {
  @route('post', '/')
  newUser(request, reply) {
    reply([])
  }
}
```

**Helper Decorators**

* `@get(path)`
* `@post(path)`
* `@put(path)`
* `@patch(path)`
* `@delete(path)`
* `@del(path)`
* `@all(path)`

These are shortcuts for `@route(method, path)` where `@get('/revoke')` would be `@route('get', '/revoke')`.

### `@options(options)`

Overall options setting if none of the other decorators are sufficient.

### `@validate(validateConfig)`

Add a validation object for the different types, except for the response.
`config` is an object, with keys for the different types, e.g. `payload`.

### `@cache(cacheConfig)`

Cache settings for the route config object.

### `@pre(preArray)`

Set prerequisite middleware array for a given route.
Expects an array, but if passed something else, it will put it into the pre array.

[babel]: https://www.npmjs.com/package/babel
[transform-decorators-legacy]: https://www.npmjs.com/package/babel-plugin-transform-decorators-legacy
[issue]: https://phabricator.babeljs.io/T2645
[post]: http://technologyadvice.github.io/es7-decorators-babel6
