module.exports = {
  root: true,
  env: {
    node: true
  },
  rules: {
    'no-control-regex': 0,
    'no-console': 'off',
    'no-debugger': 'off',
    'no-unused-vars': 1
  },
  parser: 'vue-eslint-parser',
  extends: ['eslint:recommended'],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2018,
    ecmaFeatures: {
      globalReturn: false,
      impliedStrict: false,
      jsx: false
    }
  }
}