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
#### Ignoring Specific Methods
`classes-bind-methods` can be configured to ignore every occurance of a given method name in classes throughout your project. For example, to not enforce binding for methods named `foo`, extend your `.eslintrc` file to include the following:

```js
// .eslintrc.json (or similar)
{
  ...
  "rules": {
    "classes-bind-methods/classes-bind-methods":["error", {
      ...
      "ignoreMethodNames": ["foo"],
      ...
    }],
  }
  ...
}
```

#### Subclasses
The rule can also be configured to only consider or ignore classes which extend one of a specified set classes. For example, to only consider classes which extend `foo`, modify your `.eslintrc` file to include the following:

```js
// .eslintrc.json (or similar)
{
  ...
  "rules": {
    "classes-bind-methods/classes-bind-methods":["error", {
      ...
      "onlySubclasses": ["foo"],
      ...
    }],
  }
  ...
}
```

To consider every class except those in a specific set (like `foo` and `bar`), modify your `.eslintrc` file to include the following:

```js
// .eslintrc.json (or similar)
{
  ...
  "rules": {
    "classes-bind-methods/classes-bind-methods":[{
    "classes-bind-methods/classes-bind-methods":["error", {
      ...
      "ignoreSubclasses": ["foo", "bar"],
      ...
    }],
  }
  ...
}
```

### Ignoring or including only specific file extensions

```js
// .eslintrc.json (or similar)
{
  ...
  "rules": {
    "classes-bind-methods/classes-bind-methods":["error", {
      ...
      "ignoreFileExtensions": ["foo","bar"],
      ... or ...
      "onlyFileExtensions": ["foo","bar"],
      ...
    }],
  }
  ...
}
```

### React

If you have [correctly configured eslint with React](https://github.com/yannickcr/eslint-plugin-react), standard Component lifecycle methods will automatically be ignored. If you're getting these errors and find it obnoxious to bind `render` in the `constructor`, make sure that you've included `react` in your eslint settings, as follows:

```js
// .eslintrc.json (or similar)
{
  ...
  "settings": {
    "react": {
      /* Honestly you can put whatever you want here and this rule will behave no differently */
    }
  }
  ...
}

```
`classes-bind-methods` can also be configured to ignore every occurance of a given method name in classes throughout your project. For example, to not enforce binding for methods named `foo`, extend your `.eslintrc` file to include the following:

```json
// .eslintrc.json (or similar)
{
  ...
  "rules": {
    "classes-bind-methods/classes-bind-methods":[{
      "ignoreMethodNames": ["foo"], 
    }, "error"],  
  }
  ...
}
```

## When Not To Use It

Give a short description of when it would be appropriate to turn off this rule.

## Further Reading

* [class-methods-use-this](https://github.com/eslint/eslint/blob/master/docs/rules/class-methods-use-this.md)
* [Classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)
* [Static Methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/static)
