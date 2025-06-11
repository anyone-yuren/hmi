/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ['gbeata-eslint'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  rules: {
    'implicit-arrow-linebreak': 'off',
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/no-default-export': 'off',
    'import/no-named-as-default': 'off',
    'operator-linebreak': 'off',
    'no-param-reassign': 'off',
    '@typescript-eslint/no-unused-expressions': 'off',
    'function-paren-newline': 'off',
  },
};
