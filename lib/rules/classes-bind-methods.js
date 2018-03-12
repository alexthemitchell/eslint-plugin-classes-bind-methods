/**
 * @fileoverview Expect React instances to bind methods in the constructor
 * @author Alex Mitchell
 */
'use strict';

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
    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    // Returns list of string names
    const extractBoundMethodsFromConstructorNode = (constructorNode) => {
      const constructorExpressions = constructorNode.value.body.body;
      return constructorExpressions.map(({ expression }) => {
        const isSettingThis = expression.left.object.type === 'ThisExpression'; 
        const isBindingToThis = expression.right.callee.object.object.type === 'ThisExpression' &&
          expression.right.callee.property.name === 'bind';
        const isSettingSameName = expression.left.property.name === expression.right.callee.object.property.name;
        if (isSettingThis && isBindingToThis && isSettingSameName) {
          return expression.left.property.name;
        }
      });
    };

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      ClassBody: (node) => {
        const instanceMethods = node.body.filter(dec => dec.kind === 'method' && dec.static === false);
        if (instanceMethods && instanceMethods.length) {
          const constructor = node.body.filter(dec => dec.kind === 'constructor')[0];
          if (!constructor) {
            context.report(node, 'Require constructor to bind methods');
            return;
          }
          const constructorMethods = extractBoundMethodsFromConstructorNode(constructor);
          instanceMethods.forEach(instanceMethod =>
            constructorMethods.includes(instanceMethod.key.name) ||
            context.report(instanceMethod, 'Require bind in constructor')
          );
        }
      }
    };
  }
};
