# hapi-decorators

Decorators for HapiJS routes.
Heavily inspired and borrowed from https://github.com/stewartml/express-decorators

## Usage

```no-highlight
npm install --save hapi-decorators
```

```js
import {
  controller,
  get
} from 'hapi-decorators'

@controller('/hello')
public class TestController {
  constructor(target) {
    this.target = target
  }
  
  @get('/world')
  sayHello(request, reply) {
    reply({ message: `hello, ${this.target}` })
  }
}

let test = new TestController('world')

server.routes(test.routes())
```

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
* `@all(path)`

These are shortcuts for `@route(method, path)` where `@get('/revoke')` would be `@route('get', '/revoke')`.
