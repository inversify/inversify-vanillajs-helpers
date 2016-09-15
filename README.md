# inversify-vanillajs-helpers
Some helper for the development of InversifyJS applications with VanillaJS

# Annotation helper
Helps you to reduce annotation boilerplate when working with VanillaJS so instead of writting:

```js
inversify.decorate(inversify.injectable(), Ninja);
inversify.decorate(inversify.inject(TYPES.Katana), Ninja, 0);
inversify.decorate(inversify.inject(TYPES.Shuriken), Ninja, 1);
```
You can just write:

```js
helpers.annotate(Ninja, [TYPES.Katana, TYPES.Shuriken]);
```

Let's take a look to full example:

```js
var inversify = require("inversify");
var helpers =  require("inversify-vanillajs-helpers");
require("reflect-metadata");

var TYPES = {
  Ninja: 'Ninja',
  Katana: 'Katana',
  Shuriken: 'Shuriken'
}

class Katana {
  hit () {
    return 'cut!'
  }
}

helpers.annotate(Katana);

class Shuriken {
  throw () {
    return 'hit!'
  }
}

helpers.annotate(Shuriken);

class Ninja {

  constructor(katana, shuriken) {
      this._katana = katana;
      this._shuriken = shuriken;
  }

  fight () { return this._katana.hit() }
  sneak () { return this._shuriken.throw() }

}

helpers.annotate(Ninja, [TYPES.Katana, TYPES.Shuriken]);

// Declare bindings
var kernel = new inversify.Kernel()
kernel.bind(TYPES.Ninja).to(Ninja);
kernel.bind(TYPES.Katana).to(Katana);
kernel.bind(TYPES.Shuriken).to(Shuriken);

// Resolve dependencies
var ninja = kernel.get(TYPES.Ninja);
console.log(ninja.fight(), ninja.sneak());
```

# Annotation and registration helper
Helps you to reduce annotation and registration boilerplate when working with VanillaJS so instead of writting:

```js
inversify.decorate(inversify.injectable(), Ninja);
inversify.decorate(inversify.inject(TYPES.Katana), Ninja, 0);
inversify.decorate(inversify.inject(TYPES.Shuriken), Ninja, 1);
kernel.bind(TYPES.Ninja).to(Ninja);
```
You can just write:

```js
helpers.register(kernel, TYPES.Ninja, Ninja, [TYPES.Katana, TYPES.Shuriken]);
```

Let's take a look to full example:
```js
var inversify = require("inversify");
var helpers =  require("inversify-vanillajs-helpers");
require("reflect-metadata");

var TYPES = {
  Ninja: 'Ninja',
  Katana: 'Katana',
  Shuriken: 'Shuriken'
}

class Katana {
  hit () {
    return 'cut!'
  }
}

class Shuriken {
  throw () {
    return 'hit!'
  }
}

class Ninja {

  constructor(katana, shuriken) {
      this._katana = katana;
      this._shuriken = shuriken;
  }

  fight () { return this._katana.hit() }
  sneak () { return this._shuriken.throw() }

}

// Declare bindings
var kernel = new inversify.Kernel()
helpers.register(kernel, TYPES.Katana, Katana);
helpers.register(kernel, TYPES.Shuriken, Shuriken);
helpers.register(kernel, TYPES.Ninja, Ninja, [TYPES.Katana, TYPES.Shuriken]);

// Resolve dependencies
var ninja = kernel.get(TYPES.Ninja);
console.log(ninja.fight(), ninja.sneak());
```
