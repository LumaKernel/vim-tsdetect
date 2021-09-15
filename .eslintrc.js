const configureBase = require('@luma-dev/eslint-config-base/configure');

const config = { __dirname };

/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['@luma-dev/base', '@luma-dev/jest'],
  overrides: [...configureBase(config)],
};
