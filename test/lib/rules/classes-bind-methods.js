/**
 * @fileoverview Expect React instances to bind methods in the constructor
 * @author Alex Mitchell
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require('../../../lib/rules/classes-bind-methods'),
  RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Variables
//------------------------------------------------------------------------------

const identifierSafeArbitraryString = 'ABC123';

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 6 } });
ruleTester.run('classes-bind-methods', rule, {

  valid: [
    {
      code: 'class A { constructor() { this.foo = this.foo.bind(this) } foo() {}}',
    },
    {
      code: 'class B { static foo() {} }',
    },
    {
      code: 'class C {}',
    },
    {
      code: 'class D { constructor() {} }',
    },
    {
      code: 'class E extends D { constructor(props){ super(props); this.state = props; } }',
    },
    {
      code: `class F { ${identifierSafeArbitraryString}() {} }`,
      options: [ { ignoreMethodNames: [ identifierSafeArbitraryString ] } ],
    },
    {
      code: 'class G { render() {} }',
      settings: { react: {} },
    },
    {
      code: `class H extends ${identifierSafeArbitraryString} { foo() {} }`,
      options: [ { ignoreSubclasses: [ identifierSafeArbitraryString ] } ],
    },
    {
      code: `class ${identifierSafeArbitraryString} extends I { foo() {} }`,
      options: [ { onlySubclasses: [ identifierSafeArbitraryString ] } ],
    },
    {
      code: 'class J { foo() {}}',
      options: [ { onlyFileExtensions: [ identifierSafeArbitraryString ] } ],
      filename: `${identifierSafeArbitraryString}.not${identifierSafeArbitraryString}`,
    },
    {
      code: 'class G { foo() {}}',
      options: [ { ignoreFileExtensions: [ identifierSafeArbitraryString ] } ],
      filename: `${identifierSafeArbitraryString}.${identifierSafeArbitraryString}`,
    },
  ],

  invalid: [
    {
      code: 'class Y { foo() {}}',
      errors: [{
        messageId: 'noConstructor',
        data: {
          className: 'Y',
        },
        type: 'ClassDeclaration'
      }, {
        messageId: 'methodNotBoundInConstructor',
        data: {
          className: 'Y',
          methodName: 'foo',
        },
        type: 'MethodDefinition'
      }],
      output: 'class Y { constructor(){}foo() {}}',
    }, {
      code: `class Z { constructor(x) {var y;y = x; } ${identifierSafeArbitraryString}() {}}`,
      errors: [{
        messageId: 'methodNotBoundInConstructor',
        data: {
          className: 'Z',
          methodName: identifierSafeArbitraryString,
        },
        type: 'MethodDefinition'
      }],
      output: `class Z { constructor(x) {var y;y = x;this.${identifierSafeArbitraryString} = this.${identifierSafeArbitraryString}.bind(this) } ${identifierSafeArbitraryString}() {}}`,
    },
  ]
});
