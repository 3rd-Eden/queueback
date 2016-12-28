import assume from 'assume';
import Queue from './';

describe('queueback', function () {
  let queue;

  beforeEach(function () {
    queue = new Queue();
  });

  describe('add', function () {
    it('returns false if its the first callback added', function () {
      const safe = queue.add('GET', '/url', function () {
        throw new Error('I should never be called');
      });

      assume(safe).is.false();
    });

    it('returns true if multiple callbacks are added', function () {
      let safe = queue.add('GET', '/url', function () {
        throw new Error('I should never be called');
      });

      assume(safe).is.false();

      safe = queue.add('GET', '/url', function () {
        throw new Error('I should never be called');
      });

      assume(safe).is.true();
    });

    it('always returns false for non GET requests', function () {
      let safe = queue.add('POST', '/url', function () {
        throw new Error('I should never be called');
      });

      assume(safe).is.false();

      safe = queue.add('POST', '/url', function () {
        throw new Error('I should never be called');
      });

      assume(safe).is.false();
    });;
  });

  describe('run', function () {
    it('executes all callbacks for a given method/url combination', function (next) {
      next = assume.wait(2, next);

      queue.add('GET', '/bar', next);
      queue.add('GET', '/bar', next);

      queue.run('GET', '/bar');
    });

    it('passes in all the arguments to the callbacks', function (next) {
      next = assume.wait(2, next);

      function args(arg1, arg2) {
        assume(arg1).equals('foo');
        assume(arg2).equals('bar');

        next();
      }

      queue.add('GET', '/bar', args);
      queue.add('GET', '/bar', args);

      queue.run('GET', '/bar', 'foo', 'bar');
    });

    it('only runs the callbacks for the said routes', function (next) {
      next = assume.wait(2, next);

      function args(arg1, arg2) {
        assume(arg1).equals('foo');
        assume(arg2).equals('bar');

        next();
      }

      function fail() {
        throw new Error('I should not be called');
      }

      queue.add('GET', '/bar', args);
      queue.add('GET', '/bar', args);
      queue.add('GET', '/bar/', fail);
      queue.add('GET', '/bars', fail);
      queue.add('GET', '/bars', fail);
      queue.add('POST', '/bar', fail);

      queue.run('GET', '/bar', 'foo', 'bar');
    });
  });

  describe('all', function () {
    it('executes all callbacks', function (next) {
      next = assume.wait(5, next);

      queue.add('GET', '/bar', next);
      queue.add('GET', '/bar', next);
      queue.add('POST', '/bar', next);
      queue.add('GET', '/bar/banana', next);
      queue.add('GET', '/hat/banana', next);

      queue.all();
    });
  });
});
