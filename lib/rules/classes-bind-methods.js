const _getIn = require('lodash/get');

/**
 * @fileoverview Expect ES6+ classes to bind instance methods in their constructor
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
  return constructorExpressions
    .filter(({ expression }) => expression && expression.type === 'AssignmentExpression')
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
    fixable: "code",
    schema: [
      {
        ignoreMethodNames: {
          type: 'array',
          items: {
            type: 'string',
          },
          uniqueItems: true
        }
      },
    ]
  },

  create: (context) => {
    const options = context.options[0];
    const ignoreMethodNames = (options && options.ignoreMethodNames) || []
    return {
      ClassDeclaration: (dec) => {
        const node = dec.body;
        const instanceMethodsWhichMustBeBound = extractInstanceMethodsFromBodyNode(node)
          .filter(instanceMethod => // Filter out ignored identifiers
            (ignoreMethodNames.length === 0) || !ignoreMethodNames.includes(instanceMethod.key.name))
        const constructor = extractConstructorMethodFromBodyNode(node);
        if (!constructor && instanceMethodsWhichMustBeBound.length > 0) {
          context.report({
            node,
            message: 'Class "{{ className }}" requires constructor to bind instance functions',
            data: {
              className: dec.id.name,
            },
            fix: (fixer) => fixer.insertTextBefore(node.body[0], 'constructor(){}'),
          });
        }
        const constructorMethods =  constructor ? extractBoundMethodsFromConstructorNode(constructor) : [];
        instanceMethodsWhichMustBeBound
          .forEach(instanceMethod => // Verify each remaining identifier is bound
            constructorMethods.includes(instanceMethod.key.name) ||
            context.report({
              node: instanceMethod,
              message: 'Instance method "{{ methodName }}" is not bound in constructor for class "{{ className }}"',
              data: {
                methodName: instanceMethod.key.name,
                className: dec.id.name,
              },
              fix: (fixer) => {
                if (!constructor) return fixer;
                const lastEntryOfConstructor = _getIn(constructor,
                  ['value', 'body', 'body', constructor.value.body.body.length - 1]);
                const boilerplateBinding =
                  `this.${instanceMethod.key.name} = this.${instanceMethod.key.name}.bind(this)`;
                return fixer.insertTextAfter(lastEntryOfConstructor, boilerplateBinding);
              }
            }),
          );
      }
    };
  }
};

