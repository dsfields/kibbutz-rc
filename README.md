# Kibbutz RC Plugin

RC configuration provider for Kibbutz.

The `kibbutz-rc` module is a [`kibbutz`](https://www.npmjs.com/package/kibbutz) provider for loading configuration fragments from [`rc`](https://www.npmjs.com/package/rc).

## Usage

Add `kibbutz-rc` as a dependency in `package.json`:

```sh
$ npm install kibbutz-rc -S
```

Create an instance of `RcProvider` and supply it to the `load()` method of a `Kibbutz` instance:

```js
const Kibbutz = require('kibbutz');
const RcProvider = require('kibbutz-rc');

const config = new Kibbutz({
  value: {
    foo: 'bar'
  }
});

const rcProvider = new RcProvider({
  appName: 'myapp'
});

config.load([ rcProvider ], function(err, config) {
  // do something beautiful with your configuration
});
```

## Constructor Options

The `kibbutz-rc` plugin provides options to configure the underlying `rc` module.  Constructor options should be an object, and can contain the following keys:

  * `appName`: _(required)_ the `appName` to pass to `rc`.
  * `defaults`: _(optional)_ an object that contains the default values to pass to `rc`.
  * `argv`: _(optional)_ the component `rc` should use to parse command-like arguments.
  * `parser`: _(optional)_ the parser `rc` should to interpret configuration data.
