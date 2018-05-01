<p align="center">
  <img src="https://raw.githubusercontent.com/Exelord/ember-custom-actions/master/logo.png" alt="Ember Custom Actions Logo" width="100%">

  <a href='https://travis-ci.org/Exelord/ember-custom-actions'>
    <img src="https://travis-ci.org/Exelord/ember-custom-actions.svg?branch=master"/>
  </a>
  <a href="https://david-dm.org/exelord/ember-custom-actions">
    <img src="https://david-dm.org/exelord/ember-custom-actions/status.svg">
  </a>
  <a href='https://gitter.im/Exelord/ember-custom-actions?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge'>
    <img src="https://badges.gitter.im/Exelord/ember-custom-actions.svg"/>
  </a>
  <a href="https://codeclimate.com/github/Exelord/ember-custom-actions/maintainability">
    <img src="https://api.codeclimate.com/v1/badges/86c2ffb0d59e8f2b6016/maintainability" />
  </a>
</p>

Ember Custom Actions is a package for defining custom API actions, dedicated for Ember 2.8 (and higher) applications.

# Getting started

## Demo
Before you will start with documentation check our demo app: [Ember-Custom-Actions Website](https://exelord.github.io/ember-custom-actions)

## Installation

`ember install ember-custom-actions`

## Documentation

### Model actions
To define custom action like: `posts/1/publish` you can use
`modelAction(path, options)` method with arguments:
- `path` - url of the action scoped to our api (in our case it's `publish`)
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
  console.log('Here are your serialized model errors', error.serializedErrors);
});
```

### Resource actions
To a define custom action like: `posts/favorites` you can use
`resourceAction(actionId/path, options)` method with arguments:
- `path` - url of the action scoped to our api (in our case it's `favorites`)
- `options` - optional parameter which will overwrite the configuration options

```js
import Model from 'ember-data/model';
import { resourceAction } from 'ember-custom-actions';

export default Model.extend({
  favorites: resourceAction('favorites', { method: 'GET' }),
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

### Custom actions
To define `customAction` and customize it by using ember-data flow, adapters and serializer you can use `customAction(actionId, options)` method with arguments:
- `actionId` - id of the action which can be handled later on in adpaters and serializers
- `options` - optional parameter which will overwrite the configuration options

If you want to customize your request in your adapter please, implement our adapter mixin:
```js
import JSONAPIAdapter from 'ember-data/adapters/json-api';
import { AdapterMixin } from 'ember-custom-actions';

export default JSONAPIAdapter.extend(AdapterMixin);
```

Now you can customize following methods in the adpater:
* [urlForCustomAction](#urlForCustomAction)
* [dataForCustomAction](#dataForCustomAction)
* [methodForCustomAction](#methodForCustomAction)
* [headersForCustomAction](#headersForCustomAction)


#### urlForCustomAction
You can define your custom path for every `customAction` by adding a conditional:

```js
export default JSONAPIAdapter.extend(AdapterMixin, {
  urlForCustomAction(modelName, id, snapshot, actionId, queryParams) {
    if (actionId === 'myPublishAction') {
      return 'https://my-custom-api.com/publish'
    }

    return this._super(...arguments);
  }
});
```

If you would like to build custom `modelAction` you can do it by:

```js
import { AdapterMixin } from 'ember-custom-actions';

export default JSONAPIAdapter.extend(AdapterMixin, {
  urlForCustomAction(modelName, id, snapshot, actionId, queryParams) {
    if (requestType === 'myPublishAction') {
      return `${this._buildURL(modelName, id)}/publish`;
    }

    return this._super(...arguments);
  }
});
```

#### methodForCustomAction
You can define your custom method for every `customAction` by adding a conditional:

```js
import { AdapterMixin } from 'ember-custom-actions';

export default JSONAPIAdapter.extend(AdapterMixin, {
  methodForCustomAction(params) {
    if (params.actionId === 'myPublishAction') {
      return 'PUT';
    }

    return this._super(...arguments);
  }
});
```

#### headersForCustomAction
You can define your custom headers for every `customAction` by adding a conditional:

```js
import { AdapterMixin } from 'ember-custom-actions';

export default JSONAPIAdapter.extend(AdapterMixin, {
  headersForCustomAction(params) {
    if (params.actionId === 'myPublishAction') {
      return {
        'Authorization-For-Custom-Action': 'mySuperToken123'
      };
    }

    return this._super(...arguments);
  }
});
```

#### dataForCustomAction
You can define your custom data for every `customAction` by adding a conditional:

```js
import { AdapterMixin } from 'ember-custom-actions';

export default JSONAPIAdapter.extend(AdapterMixin, {
  dataForCustomAction(params) {
    if (params.actionId === 'myPublishAction') {
      return {
        myParam: 'send it to the server'
      };
    }

    return this._super(...arguments);
  }
});
```

### Configuration

You can define your custom options in your `config/environment.js` file

``` js
module.exports = function(environment) {
  var ENV = {
    'emberCustomActions': {
      method: 'POST',
      data: {},
      headers: {},
      queryParams: {},
      ajaxOptions: {},
      adapterOptions: {},
      pushToStore: false,
      responseType: null,
      normalizeOperation: ''
    },
  };

  return ENV;
}
```
#### `method`
Default method of the request (GET, PUT, POST, DELETE, etc..)

#### `headers`
An object `{}` of custom headers. Eg:
```js
{
  'my-custom-auth': 'mySuperToken123'
}
```

#### `ajaxOptions`
Your own ajax options.
** USE ONLY IF YOU KNOW WHAT YOU ARE DOING! **
Those properties will be overwritten by ECU.

#### `pushToStore`
If you want to push the received data to the store, set this option to `true`

#### `normalizeOperation`
You can define how your outgoing data should be serialized

```

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

#### `adapterOptions`
Pass custom adapter options to handle them in `urlForCustomAction` in case of using `customAction`. Required usage of mixin: `AdpaterMixin`

#### `responseType`
You can easily observe the returned model by changing `responseType` to `array` or `object` according to what type of data
your server will return.

When `array`:
```js
model.customAction({}, { responseType: 'array' }) // returns DS.PromiseArray
```

When `object`:
```js
model.customAction({}, { responseType: 'object' }) // returns DS.PromiseObject
```

When `null` (default):
```js
model.customAction({}, { responseType: null }) // returns Promise
```
`null` is useful if you don't care about the response or just want to use `then` on the promise without using `binding` or display it in the template.

#### `queryParams`
You can pass a query params for a request by passing an `{}` with properties, eg: `{ include: 'owner' }`
** Remember: Query params are not normalized! You have to pass it in the correct format. **

# Development

### Installation

* `git clone https://github.com/Exelord/ember-custom-actions.git`
* `cd ember-custom-actions`
* `npm install`

### Linting

* `npm run lint:js`
* `npm run lint:js -- --fix`

### Running tests

* `ember test` – Runs the test suite on the current Ember version
* `ember test --server` – Runs the test suite in "watch mode"
* `ember try:each` – Runs the test suite against multiple Ember versions

### Running the dummy application

* `ember serve`
* Visit the dummy application at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

## Thanks
Big thanks to Mike North and his [Project](https://github.com/mike-north/ember-api-actions) for the initial concept.

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/exelord/ember-custom-actions. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the Contributor Covenant code of conduct.

## License

This version of the package is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).
