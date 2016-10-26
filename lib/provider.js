'use strict';

const elv = require('elv');
const rc = require('rc');


/*
  Error messages.
*/
const _msg = {
  optionsMissing: 'Arg "options" was cannot be undefined or null',
  optionsObj: 'Arg "options" must be a non-array object',
  optionsAppNameMissing: `Arg "options" must have an "appName"`,
  optionsAppNameStr: 'Arg "options" key "appName" must be a string',
  optionsDefaultsObj: 'Arg "options" key "defaults" must be a non-array object',
  optionsRcFunc: 'Arg "options" key "rc" must be a function'
};

/*
  Is Plain Old JSON Object.  Returns true if value is an object, and is not an
  Array or Date.  Otherwise false.
*/
const _isPojo = (value) => {
  return (typeof value === 'object'
          && !Array.isArray(value)
          && !(value instanceof Date)
  );
};

/*
  Asserts that an options object passed to the constructor is valid.  If it is
  not, then a TypeError is thrown.
*/
const _assertOptions = (options) => {
  if (!elv(options))
    throw new TypeError(_msg.optionsUndefined);

  if (!_isPojo(options))
    throw new TypeError(_msg.optionsObj);

  if (!elv(options.appName))
    throw new TypeError(_msg.optionsAppNameMissing);

  if (typeof options.appName !== 'string')
    throw new TypeError(_msg.optionsAppNameStr);

  if (elv(options.defaults) && !_isPojo(options.defaults))
    throw new TypeError(_msg.optionsDefaultsObj);

  if (elv(options.rc) && typeof options.rc !== 'function')
    throw new TypeError(_msg.optionsRcFunc);
};

/*
  State holder
*/
const _state = new WeakMap();

/*
  Kibbutz provider for rc-loaded configuration fragments.
*/
class RcProvider {

  /*
    Creates an instance of RcProvider.  Accepts an option argument that controls
    rc behavior.
  */
  constructor(options) {
    _assertOptions(options);
    _state.set(this, options);
  }

  /*
    Loads a configuration fragment via the rc module.  Unfortunately, rc does
    not support asynchronous operations, so we'll need to invoke the callback
    on nextTick to avoid unleashing Zalgo.
  */
  load(callback) {
    const options = _state.get(this);
    const loader = elv(options.rc) ? options.rc : rc;

    try {
      const conf = loader(options.appName,
                      options.defaults,
                      options.argv,
                      options.parser);

      process.nextTick(() => {
        callback(undefined, conf);
      });
    } catch(err) {
      process.nextTick(() => {
        callback(err, undefined);
      });
    }
  }

}

module.exports = RcProvider;
