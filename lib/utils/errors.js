module.exports = {
  methodNotBoundInConstructorErrorText: (methodName) => {
    console.log(methodName);
    return `${methodName} Method is not bound in constructor`
  },
  noConstructorErrorText: 'Class requires constructor to bind instance functions',
}

