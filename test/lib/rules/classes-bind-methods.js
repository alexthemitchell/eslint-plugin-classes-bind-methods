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
  ],

  invalid: [
    {
      code: 'class Y { foo() {}}',
      errors: [{
        message: noConstructorErrorText('Y'),
        type: 'ClassBody'
      }, {
        message: methodNotBoundInConstructorErrorText('foo', 'Y'),
        type: 'MethodDefinition'
      }]
    }, {
      code: `class Z { constructor(x) {var y;  y = x; } ${identifierSafeArbitraryString}() {}}`,
      errors: [{
        message: methodNotBoundInConstructorErrorText(identifierSafeArbitraryString, 'Z'),
        type: 'MethodDefinition'
      }]
    },
  ]
});
