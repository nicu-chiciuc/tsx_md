/** @type {import('eslint').Linter.BaseConfig} **/
module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'prettier'],

  extends: ['next', 'turbo', 'prettier', 'eslint:recommended', 'plugin:@typescript-eslint/recommended'],

  // eslint ignore files are named ".eslintignore"

  rules: {
    // TODO: Make this an error after all are solved
    // https://linear.app/robolex/issue/ROB-64/fix-all-typescript-eslintno-unnecessary-condition-warns-and-make-it
    '@typescript-eslint/no-unnecessary-condition': 'warn',

    '@typescript-eslint/no-empty-interface': 'off',
  },

  settings: {
    react: {
      version: 'detect',
    },
  },
}
