# hapi-decorators

Decorators for HapiJS routes.
Heavily inspired and borrowed from https://github.com/stewartml/express-decorators

## Usage

```no-highlight
npm install --save hapi-decorators
```

```js
import * as web from 'hapi-decorators'

@web.controller('/hello')
public class TestController {
  @web.get('/world')
  sayHelloAction(request, response) {
    response(`hello, ${this.target}`);
  }
}

let test = new TestController('world')

server.routes(test.routes())
```
