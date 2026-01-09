const globals = require('globals');

module.exports = [
  {
    ignores: [
      'build/',
      'test/',
      'docs/',
      'dist/',
      'size-demo/',
      'src/*.po.ts',
      'src/*.json.ts',
    ],
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
