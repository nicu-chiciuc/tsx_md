/** @type {import('eslint').Linter.BaseConfig} **/
module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],

  extends: ['turbo', 'prettier', 'eslint:recommended', 'plugin:@typescript-eslint/recommended'],

  rules: {
    // TODO: Make this an error after all are solved
    // https://linear.app/robolex/issue/ROB-64/fix-all-typescript-eslintno-unnecessary-condition-warns-and-make-it
    '@typescript-eslint/no-unnecessary-condition': 'warn',
  },
}
