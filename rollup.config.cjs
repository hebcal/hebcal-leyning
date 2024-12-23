const {nodeResolve} = require('@rollup/plugin-node-resolve');
const bundleSize = require('rollup-plugin-bundle-size');
const commonjs = require('@rollup/plugin-commonjs');
const json = require('@rollup/plugin-json');
const terser = require('@rollup/plugin-terser');
const typescript = require('@rollup/plugin-typescript');
const pkg = require('./package.json');
const {defineConfig} = require('rollup');

const banner = '/*! ' + pkg.name + ' v' + pkg.version + ' */';

const iifeGlobals = {
  '@hebcal/core': 'hebcal',
  '@hebcal/core/dist/esm/locale': 'hebcal',
  '@hebcal/core/dist/esm/holidays': 'hebcal',
  '@hebcal/core/dist/esm/sedra': 'hebcal',
  '@hebcal/core/dist/esm/event': 'hebcal',
  '@hebcal/core/dist/esm/ParshaEvent': 'hebcal',
};

// Override tsconfig.json, which includes ./size-demo.
const tsOptions = {rootDir: './src'};
module.exports = defineConfig([
  {
    input: ['src/index.ts', 'src/csv.ts'],
    output: [
      {
        dir: 'dist/esm',
        format: 'es',
        preserveModules: true,
        preserveModulesRoot: 'src',
        name: pkg.name,
        banner,
      },
    ],
    external: [/node_modules/, /@hebcal/],
    plugins: [
      typescript({...tsOptions, outDir: 'dist/esm'}),
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
]);
