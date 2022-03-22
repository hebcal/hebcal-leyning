import {nodeResolve} from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import pkg from './package.json';
import {terser} from 'rollup-plugin-terser';

const banner = '/*! ' + pkg.name + ' v' + pkg.version + ' */';

export default [
  {
    input: 'src/index.js',
    output: [
      {file: pkg.main, format: 'cjs', name: pkg.name, banner},
    ],
    external: ['@hebcal/core'],
    plugins: [
      json({compact: true}),
      babel({
        babelHelpers: 'bundled',
        presets: [
          ['@babel/preset-env', {
            modules: false,
            targets: {
              node: '10.21.0',
            },
          }],
        ],
        exclude: ['node_modules/**'],
      }),
    ],
  },
  {
    input: 'src/index.js',
    output: [
      {file: pkg.module, format: 'es', name: pkg.name, banner},
    ],
    external: ['@hebcal/core'],
    plugins: [
      json({compact: true, preferConst: true}),
      babel({
        babelHelpers: 'bundled',
        presets: [
          ['@babel/preset-env', {
            modules: false,
            targets: {
              node: '12.22.0',
            },
          }],
        ],
        exclude: ['node_modules/**'],
      }),
    ],
  },
  {
    input: 'src/index.js',
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
      json({compact: true}),
      nodeResolve(),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        presets: [
          ['@babel/preset-env', {
            modules: false,
            exclude: ['es.array.sort', 'es.string.replace', 'es.string.split', 'es.string.match',
              'es.string.trim'],
            targets: {
              'chrome': '58',
              'ie': '11',
            },
            useBuiltIns: 'usage',
            corejs: 3,
          }],
        ],
        exclude: ['node_modules/core-js/**'],
      }),
    ],
  },
];
