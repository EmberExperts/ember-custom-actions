<p align="center">
  <img src="https://raw.githubusercontent.com/Exelord/ember-custom-actions/master/logo.png" alt="Ember Custom Actions Logo" width="100%">

  <a href='https://travis-ci.org/Exelord/ember-custom-actions'><img src="https://travis-ci.org/Exelord/ember-custom-actions.svg?branch=master" alt="Dependency Status" /></a> <a href='https://gemnasium.com/github.com/Exelord/ember-custom-actions'><img src="https://gemnasium.com/badges/github.com/Exelord/ember-custom-actions.svg" alt="Dependency Status" /></a>
  <a href='https://gitter.im/Exelord/ember-custom-actions?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge'><img src="https://badges.gitter.im/Exelord/ember-custom-actions.svg" alt="Gitter" /></a>
</p>

Ember Custom Actions is a package for defining custom API actions, dedicated for Ember 2.8 (and higher) applications.

# Getting started

## Demo
Before you will start with documentation check our demo app: [Ember-Custom-Actions Website][43255946]
[43255946]: https://exelord.github.io/ember-custom-actions/ "Website - Demo App"

## Installation

`ember install ember-custom-actions`

## Documentation

### Model actions
To define custom action like: `posts/1/publish` you can use
`modelAction(path, options)` method with arguments:
- `path` - the url of the action (in our case it's `publish`)
- `options` - optional parameter which will overwrite the configuration options

```js
import Model from 'ember-data/model';
import { modelAction } from 'ember-custom-actions';

export default Model.extend({
  publish: modelAction('publish', { pushToStore: false }),
});

```

#### Usage
```js
let user = this.get('currentUser');
let postToPublish = this.get('store').findRecord('post', 1);
let payload = { publisher: user };

postToPublish.publish(payload, /*{ custom options }*/).then((status) => {
  alert(`Post has been: ${status}`)
}).catch((error) => {
  console.log('Here are you serialized model errors', error.serializedErrors);
});
```

### Resource actions
To a define custom action like: `posts/favorites` you can use
`resourceAction(path, options)` method with arguments:
- `path` - the url of the action (in our case it's `favorites`)
- `options` - optional parameter which will overwrite the configuration options

```js
import Model from 'ember-data/model';
import { resourceAction } from 'ember-custom-actions';

export default Model.extend({
  favorites: resourceAction('favorites', { type: 'GET' }),
});

```

#### Usage
```js
let user = this.get('currentUser');
let emptyPost = this.get('store').createRecord('post');
let payload = { user };

emptyPost.favorites(payload, /*{ custom options }*/).then((favoritesPosts) => {
  console.log(favoritesPosts);
}).finally(()=>{
  emptyPost.deleteRecord();
});
```

### Configuration

You can define your custom options in your `config/environment.js` file

``` js
module.exports = function(environment) {
  var ENV = {
    'emberCustomActions': {
      type: 'PUT',
      ajaxOptions: {},
      pushToStore: false,
      normalizeOperation: '',
      promiseType: null
    },
  };

  return ENV;
}
```
#### `type`
Default type of the request (GET, PUT, POST, DELETE, etc..)

#### `urlType`
Base of the URL which is generated for the action. If not defined, `urlType` is equal to the `type` option

#### `ajaxOptions`
Your own ajax options (e.g. headers)

#### `pushToStore`
If you want to push the received data to the store, set this option to `true` and change your application serializer:

- If you are using `JSONAPISerializer`:

``` js
// app/serializers/application.js

import { JSONAPISerializer } from 'ember-custom-actions';
export default JSONAPISerializer.extend();
```

- If you are using `RESTSerializer`:

``` js
// app/serializers/application.js

import { RESTSerializer } from 'ember-custom-actions';
export default RESTSerializer.extend();
```

#### `normalizeOperation`
You can define how your outgoing data should be serialized

Exemplary data:
```js
{
  firstParam: 'My Name',
  colors: { rubyRed: 1, blueFish: 3 }
}
```
After using a `dasherize` transformer our request data will turn into:

```js
{
  first-param: 'My Name',
  colors: { ruby-red: 1, blue-fish: 3 }
}
```
It's great for API with request data format restrictions

**Available transformers:**
  - camelize
  - capitalize
  - classify
  - dasherize
  - decamelize
  - underscore


#### `promiseType`
You can easily observe a returned model by changing promiseType to `array` or `object` according to what type of data
your server will return.

When `array`:
```js
model.customAction({}, { promiseType: 'array' }) // returns DS.PromiseArray
```

When `object`:
```js
model.customAction({}, { promiseType: 'object' }) // returns DS.PromiseObject
```

When `null` (default):
```js
model.customAction({}, { promiseType: null }) // returns Promise
```
`null` is useful if you don't care about the response or just want to use `then` on the promise without using `binding` or display it in the template.

#### `params`
You can pass a query params for a request by passing an `{}` with properties, eg: `{ include: 'owner' }`
** Remember: Query params are not normalized! You have to pass it in the correct format. **

# Development

## Installation

* `git clone https://github.com/Exelord/ember-custom-actions.git`
* `cd ember-custom-actions`
* `npm install`
* `bower install`

## Running

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

## Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

## Thanks
Big thanks to Mike North and his [Project](https://github.com/mike-north/ember-api-actions) for the initial concept.

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/exelord/ember-custom-actions. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the Contributor Covenant code of conduct.

## License

This version of the package is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).
