const configureBase = require('@luma-dev/eslint-config-base/configure');

const config = {
  __dirname,
  unresolvable: ['coc.nvim'],
};

/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['@luma-dev/base'],
  overrides: [...configureBase(config)],
};
