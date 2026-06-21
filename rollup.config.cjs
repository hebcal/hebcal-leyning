const {nodeResolve} = require('@rollup/plugin-node-resolve');
const bundleSize = require('rollup-plugin-bundle-size');
const json = require('@rollup/plugin-json');
const terser = require('@rollup/plugin-terser');
const typescript = require('@rollup/plugin-typescript');
const pkg = require('./package.json');
const {defineConfig} = require('rollup');

const banner = '/*! ' + pkg.name + ' v' + pkg.version + ' */';

const iifeGlobals = {
  '@hebcal/core/dist/esm/event': 'hebcal',
  '@hebcal/core/dist/esm/locale': 'hebcal',
  '@hebcal/core/dist/esm/sedra': 'hebcal',
  '@hebcal/core/dist/esm/holidays': 'hebcal',
  '@hebcal/core/dist/esm/ParshaEvent': 'hebcal',
  '@hebcal/core/dist/esm/HolidayEvent': 'hebcal',
};

module.exports = defineConfig([
  {
    input: ['src/index.ts', 'src/csv.ts'],
    output: {
      dir: 'dist/esm',
      format: 'es',
      preserveModules: true,
      preserveModulesRoot: 'src',
      banner,
      sourcemap: true,
    },
    external: [/node_modules/, /@hebcal/],
    plugins: [
      typescript({outDir: 'dist/esm', sourceMap: true}),
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
      typescript({target: 'es2021', declaration: false}),
      json({compact: true, preferConst: true}),
      nodeResolve(),
      bundleSize(),
    ],
  },
]);
