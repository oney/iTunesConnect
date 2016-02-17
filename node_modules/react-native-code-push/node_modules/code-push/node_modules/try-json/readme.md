try-json
========

Try/catch wrapper around `JSON.parse`.


Install
-------

With [npm](https://npmjs.org)

```
npm install try-json
```

Usage
-----

Node.js

```js
var tryJSON = require('try-json')

tryJSON('{"ab": 2}') // {ab: 2}
tryJSON('[1,2,3,4]') // [1, 2, 3, 4]
tryJSON('woaaaaaa!') // undefined
```
