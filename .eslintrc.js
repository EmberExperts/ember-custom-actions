module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  },
  extends: [
    'eslint:recommended',
    'plugin:ember-suave/recommended'
  ],
  env: {
    'browser': true
  },
  globals: {
    swal: true,
    EmberENV: true,
    moment: true,
    autosize: true
  }
};
