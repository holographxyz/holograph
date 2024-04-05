module.exports = {
  extends: ['turbo', 'prettier'],
  rules: {
    'turbo/no-undeclared-env-vars': 0
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  env: {
    es6: true
  }
};
