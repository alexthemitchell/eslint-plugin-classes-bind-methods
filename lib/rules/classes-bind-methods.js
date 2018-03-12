const _getIn = require('lodash/get');

const { NO_BIND_IN_CONSTRUCTOR_TEXT, NO_CONSTRUCTOR_TEXT } = require('../constants/Errors.json');

/**
 * @fileoverview Expect React instances to bind methods in the constructor
 * @author Alex Mitchell
 */
'use strict';

/**
 * extractBoundMethodsFromConstructorNode
 * Returns the list of identifiers (Strings) of bound local functions
 * e.g. 'foo' from `this.foo = this.foo.bind(this)`
 */
const extractBoundMethodsFromConstructorNode = (constructorNode) => {
  const constructorExpressions = constructorNode.value.body.body;
  return constructorExpressions.filter(({ expression }) => expression && expression.type === 'AssignmentExpression')
    .map(({ expression }) => {
      const isSettingThis = _getIn(expression, ['left', 'object', 'type']) === 'ThisExpression';
      const isBindingToThis =
        _getIn(expression, ['right', 'callee', 'object', 'object', 'type']) === 'ThisExpression'
        && _getIn(expression, ['right', 'callee', 'property', 'name']) === 'bind';
      const isSettingSameName = _getIn(expression, ['left', 'property', 'name']) ===
        _getIn(expression, ['right','callee', 'object', 'property', 'name']);
      if (isSettingThis && isBindingToThis && isSettingSameName) {
        return expression.left.property.name;
      }
    });
};

const extractInstanceMethodsFromBodyNode = (bodyNode) =>
  bodyNode.body.filter(node => node.kind === 'method' && node.static === false);

const extractConstructorMethodFromBodyNode = (bodyNode) =>
  bodyNode.body.filter(node => node.kind === 'constructor')[0];

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Expect classes to bind instance methods in constructor',
      category: 'Fill me in',
      recommended: false
    },
    fixable: null,  // or "code" or "whitespace"
    schema: [
      // fill in your schema
    ]
  },

  create: function(context) {
    return {
      ClassBody: (node) => {
        const instanceMethods = extractInstanceMethodsFromBodyNode(node);
        if (instanceMethods.length) { // If there are any instance methods
          const constructor = extractConstructorMethodFromBodyNode(node);
          if (!constructor) {
            context.report(node, NO_CONSTRUCTOR_TEXT);
            return;
          }
          const constructorMethods = extractBoundMethodsFromConstructorNode(constructor);
          instanceMethods.forEach(instanceMethod =>
            constructorMethods.includes(instanceMethod.key.name) ||
            context.report(instanceMethod, NO_BIND_IN_CONSTRUCTOR_TEXT)
          );
        }
      }
    };
  }
};

