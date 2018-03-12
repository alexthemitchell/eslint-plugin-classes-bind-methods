# Expect classes to bind instance methods in the constructor (`classes-bind-methods`)

Instance methods which call out to other instance methods or variables using the `this` keyword must have been bound to `this` before the call, otherwise a TypeError will occur. 

## Rule Details

Reduce the occurance of TypeErrors caused by dereferencing an undefined `this` inside an instance method.

Examples of **incorrect** code for this rule:

```js

class Y {
  foo() {}
}

class Z {
  constructor() {}

  foo() {}
}

```

Examples of **correct** code for this rule:

```js

class A {
  constructor() {
    /* ... */
    this.foo = this.foo.bind(this);
    /* ... */
  }

  foo() {/* ... */}
}

class B {
  static bar() {/* ... */}
}

class C {}

class D {
  constructor() {
    /* ... */
  }
}
```

### Options

React: Should disable default overridden react functions

## When Not To Use It

Give a short description of when it would be appropriate to turn off this rule.

## Further Reading

* [class-methods-use-this](https://github.com/eslint/eslint/blob/master/docs/rules/class-methods-use-this.md) 
* [Classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)
* [Static Methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/static)
