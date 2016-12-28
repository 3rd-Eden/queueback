# queueback

Callback queue system for optimizing HTTP requests by reducing potential
duplicate requests. It basically allows you to queue callbacks based on HTTP
method and URL.

## Install

The module is released as ES6 module in the npm registry and can be installed
using:

```
npm install --save queueback
```

## API

Import and construct the queue using the following syntax:

```js
import Queue from 'queueback';

const queue = new Queue();
```

### add

Add a new callback to a method and URL specific queue. The method accepts the
following arguments:

- `method` HTTP method
- `url` URL that is being requested
- `fn` Callback to queue

The method will return a boolean that is an indication if we have queue in
process for this callback so no new request should be made.

```js
if (queue.add('GET', 'http://google.com', fn)) return;
```

Please note that we guarantee that the callback is only called once and removed
from the queue after execution.

### run

This allows you to execute all queued callbacks for the given method and URL
combination. It accepts the following arguments.

- `method` HTTP method
- `url` URL that is being requested

All of the other arguments are passed in to the queued callbacks.

```js
queue.run('GET', 'http://google.com', new Error('Failed to load google'));
```

### all

Execute all the queued callbacks regardless of their method and URL
combinations. All arguments are passed in to the queued callbacks.

```js
queue.all(new Error('Unable to authenticate with server'));
```

## License

MIT
