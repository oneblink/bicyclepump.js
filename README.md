# bicyclepump.js

JavaScript Object Inflation with Dependency Injection

## Status

This is a work-in-progress. We'll tag this once the below API is implemented.

## What is it?

This project is inspired by [Angular.JS' dependency injection](http://docs.angularjs.org/api/auto/service/$injector), [Express.JS' middleware](http://expressjs.com/3x/api.html#app.use), and [PHP's spl_autoload_register](php.net/manual/en/function.spl-autoload-register.php).

Bicycle Pump combines the following:

- **inflation**: taking a plain JavaScript Object and transforming it (usually with a constructor Function)

- **injection**: requesting something (usually a Function or module) by an identifying token

Our use case involves:

- we have just retrieved a JavaScript Object from storage, or the network

- we want to register a number of inflator Functions (a.k.a. Inflators)

- each Inflator should be given the Object one-by-one, until it is inflated

- Inflators decide for themselves whether they are appropriate or not

This gives us a way to decouple our code, and also allows downstream consumers of our projects to enhance and extend our projects at runtime.

## API

`BicyclePump` is installed in the global namespace, unless it detects AMD or CommonJS module usage.

Note: this notation is [JSDoc3](http://usejsdoc.org/about-namepaths.html), where `#` indicates an instance member, `.` indicates a static member, and `~` indicates an inner class or member.

### BicycleBump~inflator = function (obj, done, next)

- @param {Object} `obj`
- @param {BicycleBump~inflatorDone} `done`
- @param {BicycleBump~inflatorNext} `next`

This is the definition of an Inflator. Each Inflator accepts an Object `obj` as its first parameter. Inflators are always asynchronous, so they are expected to call `done()` or `next()` when finished, rather than return a value.

Inflators should interrogate `obj` and determine how to proceed:

- call `next()` if this Inflator cannot handle this `obj`, passing to the next Inflator
- call `done()` when no other Inflator should be given a turn

For example:

```javascript
function anInflator(obj, done, next) {
  if (!obj || typeof obj !== 'object') {
    done(new Error('Object cannot be inflated'));
    return;
  }
  if (!obj.name) {
    // this Inflator needs a "name" property
    next(); // try the next Inflator
    return;
  }
  done(new NamedObject(obj));
}
```

### BicycleBump~inflatorDone = function (result)

- @param {Object|Error} [`result`] (optional)

This is the function called by an Inflator when no other Inflator should be tried.

If the Object was not inflated successfully, or should never be, then `result` should be falsey or an Error.

Otherwise, `result` should be the successfully inflated result.

### BicycleBump~inflatorNext = function ()

This is the function called by an Inflator when the next Inflator should have a turn. This signals that the current Inflator determined that it was not suitable.

### BicyclePump#addInflator = function (fn)

- @param {BicycleBump~inflator} `fn`

Registers an Inflator function. e.g.

```javascript
var myInflators = new BicyclePump();
myInflators.addInflator(function (obj, done, next) {/* ... */})
```

### BicyclePump#removeInflator = function (fn)

- @param {BicycleBump~inflator} `fn`

If the provided Inflator was registered, unregister it so that it would be called.

### BicyclePump#getInflators = function ()

- @return {Array.<BicycleBump~inflator>}

### BicyclePump#inflate = function (obj, callback)

- @param {Object} `obj`
- @param {BicycleBump~inflationDone} [`callback`] (optional)
- @return {Promise} but only if environment offers ES6 Promises

This is for consumers that have an Object and need it inflated. When invoked, each registered Inflator will be called one-by-one, newest registrations first (Last-In-First-Out). e.g.

```javascript
var myInflators = new BicyclePump();
myInflators.addInflator(function third(obj, done, next) {/* ... */});
myInflators.addInflator(function second(obj, done, next) {/* ... */});
myInflators.addInflator(function first(obj, done, next) {/* ... */});

myInflators.inflate({ /* ... */ });
```

### BicycleBump~inflationDone = function (err, result)

- @param {Error} `err`
- @param {Object} `result`

This is a CommonJS-style callback, in that `err` will be falsey if there were no errors.

## License

This is governed by the BSD 3-clause license.
