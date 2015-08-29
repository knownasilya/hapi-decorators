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
