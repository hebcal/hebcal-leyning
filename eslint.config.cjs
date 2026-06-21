const globals = require('globals');

module.exports = [
  {
    ignores: ['test/', 'dist/', 'size-demo/', 'src/*.po.ts'],
  },
  ...require('gts'),
  {
    files: ['**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
];
