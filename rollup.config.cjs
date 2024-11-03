const {nodeResolve} = require('@rollup/plugin-node-resolve');
const bundleSize = require('rollup-plugin-bundle-size');
const commonjs = require('@rollup/plugin-commonjs');
const json = require('@rollup/plugin-json');
const terser = require('@rollup/plugin-terser');
const typescript = require('@rollup/plugin-typescript');
const {dts} = require('rollup-plugin-dts');
const pkg = require('./package.json');
const {defineConfig} = require('rollup');

const banner = '/*! ' + pkg.name + ' v' + pkg.version + ' */';

const iifeGlobals = {
  '@hebcal/core': 'hebcal',
  '@hebcal/core/dist/es/locale': 'hebcal',
  '@hebcal/core/dist/es/holidays': 'hebcal',
  '@hebcal/core/dist/es/sedra': 'hebcal',
  '@hebcal/core/dist/es/event': 'hebcal',
  '@hebcal/core/dist/es/ParshaEvent': 'hebcal',
};

// Override tsconfig.json, which includes ./size-demo.
const tsOptions = {rootDir: './src'};
module.exports = defineConfig([
  {
    input: 'src/index.ts',
    output: [{file: pkg.main, format: 'cjs', name: pkg.name, banner}],
    external: ['@hebcal/core'],
    plugins: [
      typescript(tsOptions),
      nodeResolve(),
      commonjs(),
      json({compact: true, preferConst: true}),
      bundleSize(),
    ],
  },
  {
    input: 'src/index.ts',
    output: [{file: pkg.module, format: 'es', name: pkg.name, banner}],
    external: ['@hebcal/core'],
    plugins: [
      typescript(tsOptions),
      commonjs(),
      nodeResolve(),
      json({compact: true, preferConst: true}),
      bundleSize(),
    ],
  },
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/bundle.js',
        format: 'iife',
        name: 'hebcal__leyning',
        globals: iifeGlobals,
        indent: false,
        banner,
      },
      {
        file: 'dist/bundle.min.js',
        format: 'iife',
        name: 'hebcal__leyning',
        globals: iifeGlobals,
        plugins: [terser()],
        banner,
      },
    ],
    external: [/@hebcal\/core/],
    plugins: [
      typescript(tsOptions),
      json({compact: true, preferConst: true}),
      nodeResolve(),
      commonjs(),
      bundleSize(),
    ],
  },
  {
    input: 'dist/index.d.ts',
    output: [{file: 'dist/module.d.ts', format: 'es'}],
    external: ['node:fs'],
    plugins: [dts()],
  },
]);
