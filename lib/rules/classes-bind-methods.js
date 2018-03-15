const _getIn = require('lodash/get');
const { reactBoundMethods } = require('../constants/methodNames.json');

/**
 * @fileoverview Expect ES6+ classes to bind instance methods in their constructor
 * @author Alex Mitchell
 */
'use strict';

const extractOptionsFromContext = context => context.options[0] || {};

const extractIgnoreMethodNamesFromContext = (context) => {
  const options = extractOptionsFromContext(context);
  const settings = context.settings;
  const optionsIgnore = options.ignoreMethodNames || [];
  const settingsIgnore = settings.react ? reactBoundMethods : [];

  return optionsIgnore.concat(settingsIgnore);
};

const extractIgnoreSubclassesFromContext = (context) => {
  const options = extractOptionsFromContext(context);
  return options.ignoreSubclasses;
};

const extractOnlySubclassesFromContext = (context) => {
  const options = extractOptionsFromContext(context);
  return options.onlySubclasses;
};

/**
 * extractBoundMethodsFromConstructorNode
 * Returns the list of identifiers (Strings) of bound local functions
 * e.g. 'foo' from `this.foo = this.foo.bind(this)`
 */
const extractBoundMethodsFromConstructorNode = (constructorNode) => {
  if (!constructorNode) return [];
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

const extractInstanceMethodsFromBodyNode = (bodyNode, ignoreMethodNames) =>
  bodyNode.body.filter(node => node.kind === 'method' && node.static === false)
    .filter(instanceMethod =>
      // Filter out ignored identifiers
      (ignoreMethodNames.length === 0) || !ignoreMethodNames.includes(instanceMethod.key.name));
;

const extractConstructorMethodFromBodyNode = (bodyNode) =>
  bodyNode.body.filter(node => node.kind === 'constructor')[0];

const reportConstructor = (context, classNode) => {
  context.report({
    node: classNode,
    message: 'Class "{{ className }}" requires constructor to bind instance functions',
    data: {
      className: classNode.id.name,
    },
    fix: (fixer) => fixer.insertTextBefore(classNode.body.body[0], 'constructor(){}'),
  });
};

const reportUnbound = (context, methodNode, className, constructor) => {
  const methodName = methodNode.key.name;
  context.report({
    node: methodNode,
    message: 'Instance method "{{ methodName }}" is not bound in constructor for class "{{ className }}"',
    data: {
      methodName,
      className,
    },
    fix: (fixer) => {
      if (!constructor) return fixer;
      const lastEntryOfConstructor = _getIn(constructor,
        ['value', 'body', 'body', constructor.value.body.body.length - 1]);
      const boilerplateBinding =
        `this.${methodName} = this.${methodName}.bind(this)`;
      return fixer.insertTextAfter(lastEntryOfConstructor, boilerplateBinding);
    }
  });
};

const shouldConsiderClass = (classDec, onlySubclasses, ignoreSubclasses) =>
  !classDec.superClass ||
    (ignoreSubclasses && !ignoreSubclasses.includes(classDec.superClass.name)) ||
    (onlySubclasses && onlySubclasses.includes(classDec.superClass.name));

// Verify each remaining identifier is bound
const verifyAndReport = (context, methods, className, constructor) => {

        const constructorMethods = extractBoundMethodsFromConstructorNode(constructor);
        methods.forEach(instanceMethod =>
          constructorMethods.includes(instanceMethod.key.name) ||
          reportUnbound(context, instanceMethod, className, constructor)
        )
};


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
        },
        ignoreSubclasses: {
          type: 'array',
          items: {
            type: 'string',
          },
          uniqueItems: true
        },
        onlySubclasses: {
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
    const ignoreSubclasses = extractIgnoreSubclassesFromContext(context);
    const onlySubclasses = extractOnlySubclassesFromContext(context);
    const ignoreMethodNames = extractIgnoreMethodNamesFromContext(context);

    return {
      ClassDeclaration: (dec) => {
        if ((onlySubclasses || ignoreSubclasses) &&
          !shouldConsiderClass(dec, onlySubclasses, ignoreSubclasses)) return;
        const node = dec.body;
        const instanceMethodsWhichMustBeBound =
          extractInstanceMethodsFromBodyNode(node, ignoreMethodNames);
        const constructor = extractConstructorMethodFromBodyNode(node);
        if (!constructor && instanceMethodsWhichMustBeBound.length > 0) {
          reportConstructor(context, dec);
        }
        verifyAndReport(context, instanceMethodsWhichMustBeBound, dec.id.name, constructor);
      }
    };
  }
};

