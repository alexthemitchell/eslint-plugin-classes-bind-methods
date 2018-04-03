# eslint-plugin-classes-bind-methods
[![npm version](https://badge.fury.io/js/eslint-plugin-classes-bind-methods.svg)](https://badge.fury.io/js/eslint-plugin-classes-bind-methods)
[![Build Status](https://travis-ci.org/alexthemitchell/eslint-plugin-classes-bind-methods.svg?branch=master)](https://travis-ci.org/alexthemitchell/eslint-plugin-classes-bind-methods)
[![Coverage Status](https://coveralls.io/repos/github/alexthemitchell/eslint-plugin-classes-bind-methods/badge.svg)](https://coveralls.io/github/alexthemitchell/eslint-plugin-classes-bind-methods)
[![Maintainability](https://api.codeclimate.com/v1/badges/0f3c18fe6f2a25730b95/maintainability)](https://codeclimate.com/github/alexthemitchell/eslint-plugin-classes-bind-methods/maintainability)

Expect classes to bind instance methods in the constructor

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-classes-bind-methods`:

```
$ npm install eslint-plugin-classes-bind-methods --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-classes-bind-methods` globally.

## Purpose

Instance methods which call out to other instance methods or variables using the `this` keyword must have been bound to `this` before the call, otherwise a TypeError will occur.

## Rule Details

Reduce the occurance of TypeErrors caused by dereferencing an undefined `this` inside an instance method.


## Usage

Add `classes-bind-methods` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "classes-bind-methods"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "classes-bind-methods/classes-bind-methods": "error"
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
To only apply this rule (or conversely, not apply this rule) to files with a specific file extension (e.g. `.jsx` files), modify your `.eslintrc` file to include the following:

```js
// .eslintrc.json (or similar)
{
  ...
  "rules": {
    "classes-bind-methods/classes-bind-methods":["error", {
      ...
      "ignoreFileExtensions": ["js","foo"],
      ... or ...
      "onlyFileExtensions": ["jsx","bar"],
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


## Supported Rules

* [classes-bind-methods](https://github.com/alexthemitchell/eslint-plugin-classes-bind-methods/blob/master/docs/rules/classes-bind-methods.md)
