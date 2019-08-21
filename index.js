import EventEmitter from 'eventemitter3';

/**
 * Queueback is a callback queue for optimizing your HTTP requests.
 *
 * @constructor
 * @public
 */
export default class Queueback extends EventEmitter {
  /**
   * Compile method and URL to "semi" unique id.
   *
   * @param {String} method HTTP method we're using.
   * @param {String} url The HTTP URL we're hitting.
   * @returns {String} id
   * @private
   */
  id (method, url) {
    return [method.toUpperCase(), url].join(':');
  }

  /**
   * Add a callback
   *
   * @param {String} method HTTP method we're using.
   * @param {String} url The HTTP URL we're hitting.
   * @param {Function} fn Completion Callback.
   * @returns {Booelan} Indication if multiple callbacks are queued.
   * @public
   */
  add (method, url, fn){
    const id = this.id(method, url);
    const previously = this.listenerCount(id);

    this.once(id, fn);

    //
    // GET requests are the only requests that should be and can be queued.
    // Requests that can modify state on servers like POST and PUT should never
    // be cached so we need to return a correct indication if it's save to
    // ignore the request.
    //
    if (method === 'GET') return previously !== 0;
    return false;
  }

  /**
   * Remove a callback from a queue.
   *
   * @param {String} method HTTP method we're using.
   * @param {String} url The HTTP URL we're hitting.
   * @param {Function} fn Completion Callback.
   * @public
   */
  remove(method, url, fn) {
    return this.removeListener(this.id(method, url), fn);
  }

  /**
   * Call all queued callbacks for a given method/URL combination.
   *
   * @param {String} method HTTP method we're using.
   * @param {String} url The HTTP URL we're hitting.
   * @param {...} args Arguments that the callbacks should receive.
   * @returns {Boolean} Indication if we've called callbacks.
   * @public
   */
  run (method, url, ...args) {
    return this.emit(this.id(method, url), ...args);
  }

  /**
   * Execute all queued callbacks with the given arguments.
   *
   * @param {...} args Arguments that the callbacks should receive.
   * @public
   */
  all(...args) {
    this.eventNames().forEach((name) => {
      this.emit(name, ...args);
    });
  }
}
