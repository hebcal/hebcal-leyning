const {nodeResolve} = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const json = require('@rollup/plugin-json');
const terser = require('@rollup/plugin-terser');
const typescript = require('@rollup/plugin-typescript');
const {dts} = require('rollup-plugin-dts');
const pkg = require('./package.json');

const banner = '/*! ' + pkg.name + ' v' + pkg.version + ' */';

module.exports = [
  {
    input: 'src/index.ts',
    output: [
      {file: pkg.main, format: 'cjs', name: pkg.name, banner},
    ],
    external: ['@hebcal/core'],
    plugins: [
      typescript(),
      json({compact: true, preferConst: true}),
    ],
  },
  {
    input: 'src/index.ts',
    output: [
      {file: pkg.module, format: 'es', name: pkg.name, banner},
    ],
    external: ['@hebcal/core'],
    plugins: [
      typescript(),
      json({compact: true, preferConst: true}),
    ],
  },
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/bundle.js',
        format: 'iife',
        name: 'hebcal__leyning',
        globals: {
          '@hebcal/core': 'hebcal',
        },
        indent: false,
        banner,
      },
      {
        file: 'dist/bundle.min.js',
        format: 'iife',
        name: 'hebcal__leyning',
        globals: {
          '@hebcal/core': 'hebcal',
        },
        plugins: [terser()],
        banner,
      },
    ],
    external: ['@hebcal/core'],
    plugins: [
      typescript(),
      json({compact: true, preferConst: true}),
      nodeResolve(),
      commonjs(),
    ],
  },
  {
    input: 'dist/index.d.ts',
    output: [{file: 'dist/module.d.ts', format: 'es'}],
    external: ['node:fs'],
    plugins: [dts()],
  },
];
