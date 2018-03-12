# eslint-plugin-classes-bind-methods

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
        "classes-bind-methods/rule-name": 2
    }
}
```

## Supported Rules

* Fill in provided rules here





