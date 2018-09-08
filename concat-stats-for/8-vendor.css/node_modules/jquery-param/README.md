# jquery-param
[![Circle CI](https://circleci.com/gh/knowledgecode/jquery-param.svg?style=shield)](https://circleci.com/gh/knowledgecode/jquery-param)

## Features
- Equivalent to jQuery.param (based on jQuery 3.x)
- No dependencies
- Universal (Isomorphic)
- ES5

## Installation
Node.js:
```shell
$ npm install jquery-param --save
```
Bower (DEPRECATED):
```shell
$ bower install jquery-param
```
the browser:
```html
<script src="jquery-param.min.js"></script>
```

## Usage
Node.js:
```javascript
const param = require('jquery-param');

let obj = { key1: 'value1', key2: [10, 20, 30] };
let str = param(obj);
// => "key1=value1&key2[]=10&key2[]=20&key2[]=30"
```
AMD:
```javascript
require(['jquery-param'], function (param) {
    var obj = { key1: { value1: [10, 20, 30] }, key2: '?a=b&c=d' };
    var str = param(obj);
    // => "key1[value1][]=10&key1[value1][]=20&key1[value1][]=30&key2=?a=b&c=d"
});
```
directly:
```javascript
var obj = { key1: { value1: [10, 20, 30] }, key2: '?a=b&c=d' };
var str = window.param(obj);    // global object
// => "key1[value1][]=10&key1[value1][]=20&key1[value1][]=30&key2=?a=b&c=d"
```

## Browser Support
Chrome, Firefox, Safari, Edge, and IE9+.

## License
MIT
