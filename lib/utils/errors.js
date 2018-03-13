module.exports = {
  methodNotBoundInConstructorErrorText: (methodName, className) => `${methodName} is not bound in constructor for ${className}`,
  noConstructorErrorText: (className) => `${className} requires constructor to bind instance functions`,
}

