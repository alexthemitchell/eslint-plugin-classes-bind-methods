# eslint-plugin-classes-bind-methods
[![Build Status](https://travis-ci.org/alexthemitchell/eslint-plugin-classes-bind-methods.svg?branch=master)](https://travis-ci.org/alexthemitchell/eslint-plugin-classes-bind-methods)
[![Coverage Status](https://coveralls.io/repos/github/alexthemitchell/eslint-plugin-classes-bind-methods/badge.svg)](https://coveralls.io/github/alexthemitchell/eslint-plugin-classes-bind-methods)
[![npm version](https://badge.fury.io/js/eslint-plugin-classes-bind-methods.svg)](https://badge.fury.io/js/eslint-plugin-classes-bind-methods)

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

## Supported Rules

* [classes-bind-methods](https://github.com/alexthemitchell/eslint-plugin-classes-bind-methods/blob/master/docs/rules/classes-bind-methods.md)
