/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ['@gbeata'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  rules: {
    '@typescript-eslint/no-unused-expressions': 'off',
    // 添加 Prettier 规则覆盖
    'prettier/prettier': [
      'error',
      {
        printWidth: 120,
        tabWidth: 2,
        useTabs: false,
        singleQuote: true,
        jsxSingleQuote: true,
        bracketSpacing: true,
        bracketSameLine: false,
        arrowParens: 'always',
        endOfLine: 'lf',
      },
      {
        // 使用项目中的 Prettier 配置
        usePrettierrc: false, // 禁用 .prettierrc 文件读取
      },
    ],
  },
};
