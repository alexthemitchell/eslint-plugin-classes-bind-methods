/**
 * @fileoverview Expect React instances to bind methods in the constructor
 * @author Alex Mitchell
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { methodNotBoundInConstructorErrorText, noConstructorErrorText } = require('../../../lib/utils/errors');

var rule = require('../../../lib/rules/classes-bind-methods'),
  RuleTester = require('eslint').RuleTester;


//------------------------------------------------------------------------------
// Variables
//------------------------------------------------------------------------------

const identifierSafeArbitraryString = 'ABC123';

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('classes-bind-methods', rule, {

  valid: [
    {
      code: 'class A { constructor() { this.foo = this.foo.bind(this) } foo() {}}',
      parserOptions: { ecmaVersion: 6 },
    },
    {
      code: 'class B { static foo() {} }',
      parserOptions: { ecmaVersion: 6 },
    },
    {
      code: 'class C {}',
      parserOptions: { ecmaVersion: 6 },
    },
    {
      code: 'class D { constructor() {} }',
      parserOptions: { ecmaVersion: 6 },
    },
    {
      code: 'class E extends D { constructor(props){ super(props); this.state = props; } }',
      parserOptions: { ecmaVersion: 6 },
    },
    {
      code: `class F { ${identifierSafeArbitraryString}() {} }`,
      parserOptions: { ecmaVersion: 6 },
      options: [ { ignoreMethodNames: [ identifierSafeArbitraryString ] } ],
    },
  ],

  invalid: [
    {
      code: 'class Y { foo() {}}',
      parserOptions: { ecmaVersion: 6 },
      errors: [{
        message: noConstructorErrorText,
        type: 'ClassBody'
      }]
    }, {
      code: `class Z { constructor(x) {var y;  y = x; } ${identifierSafeArbitraryString}() {}}`,
      parserOptions: { ecmaVersion: 6 },
      errors: [{
        message: methodNotBoundInConstructorErrorText(identifierSafeArbitraryString),
        type: 'MethodDefinition'
      }]
    },
  ]
});
