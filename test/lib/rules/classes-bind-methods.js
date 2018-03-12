/**
 * @fileoverview Expect React instances to bind methods in the constructor
 * @author Alex Mitchell
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { NO_CONSTRUCTOR_TEXT, NO_BIND_IN_CONSTRUCTOR_TEXT } = require('../../../lib/constants/Errors.json');
var rule = require('../../../lib/rules/classes-bind-methods'),

  RuleTester = require('eslint').RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('react-bind-this', rule, {

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
  ],

  invalid: [
    {
      code: 'class Y { foo() {}}',
      parserOptions: { ecmaVersion: 6 },
      errors: [{
        message: NO_CONSTRUCTOR_TEXT,
        type: 'ClassBody'
      }]
    }, {
      code: 'class Z { constructor(x) {var y;  y = x; } foo() {}}',
      parserOptions: { ecmaVersion: 6 },
      errors: [{
        message: NO_BIND_IN_CONSTRUCTOR_TEXT,
        type: 'MethodDefinition'
      }]
    },
  ]
});
