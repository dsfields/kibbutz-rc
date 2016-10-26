'use strict';

const assert = require('chai').assert;

const RcProvider = require('../../lib/provider');

describe('RcProvider', () => {

  describe('#constructor', () => {
    it('should throw if options undefined', () => {
      assert.throws(() => {
        const provider = new RcProvider();
      }, TypeError);
    });

    it('should throw if options null', () => {
      assert.throws(() => {
        const provider = new RcProvider(null);
      }, TypeError);
    });

    it('should throw if options not an object', () => {
      assert.throws(() => {
        const provider = new RcProvider(42);
      }, TypeError);
    });

    it('should throw if options an array', () => {
      assert.throws(() => {
        const provider = new RcProvider([42]);
      }, TypeError);
    });

    it('should throw if options a Date', () => {
      assert.throws(() => {
        const provider = new RcProvider(new Date(1978, 6, 20));
      }, TypeError);
    });

    it('should throw if options.appName not provided', () => {
      assert.throws(() => {
        const provider = new RcProvider({});
      }, TypeError);
    });

    it('should throw if options.appName not a string', () => {
      assert.throws(() => {
        const provider = new RcProvider({ appName: 42 });
      }, TypeError);
    });

    it('should throw if options.defaults not an object', () => {
      assert.throws(() => {
        const provider = new RcProvider({
          appName: 'test',
          defaults: 42
        });
      }, TypeError);
    });

    it('should throw if options.defaults an array', () => {
      assert.throws(() => {
        const provider = new RcProvider({
          appName: 'test',
          defaults: []
        });
      }, TypeError);
    });

    it('should throw if options.defaults a Date', () => {
      assert.throws(() => {
        const provider = new RcProvider({
          appName: 'test',
          defaults: new Date(1978, 6, 20)
        });
      }, TypeError);
    });

    it('should throw if options.rc not a function', () => {
      assert.throws(() => {
        const provider = new RcProvider({
          appName: 'test',
          rc: 42
        });
      }, TypeError);
    });
  });

  describe('#load', () => {
    let provider;

    const defaults = {
      foo: 'bar'
    };

    beforeEach((done) => {
      provider = new RcProvider({
        appName: 'test',
        defaults: defaults
      });
      done();
    });

    it('should call callback with config fragment', (done) => {
      provider.load((err, fragment) => {
        assert.isOk(fragment);
        done();
      });
    });

    it('should call callback with err set to undefined on success', (done) => {
      provider.load((err, fragment) => {
        assert.isNotOk(err);
        done();
      });
    });

    it('should call callback with err when failed', (done) => {
      const errProvider = new RcProvider({
        appName: 'test',
        defaults: defaults,
        rc: () => { throw new Error('Blah'); }
      });

      errProvider.load((err, fragment) => {
        assert.isOk(err);
        done();
      });
    });
  });

});
