import {nodeResolve} from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import pkg from './package.json';
import {terser} from 'rollup-plugin-terser';

export default [
  {
    input: 'src/index.js',
    output: {
      file: pkg.main, format: 'cjs', name: pkg.name,
      banner: '/*! ' + pkg.name + ' v' + pkg.version + ' */',
    },
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
      nodeResolve(),
      commonjs(),
    ],
  },
  {
    input: 'src/index.js',
    output: {
      file: pkg.module, format: 'es', name: pkg.name,
      banner: '/*! ' + pkg.name + ' v' + pkg.version + ' */',
    },
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
      nodeResolve(),
      commonjs(),
    ],
  },
  {
    input: 'src/index.js',
    output: [
      {
        file: pkg.browser,
        format: 'iife',
        name: 'hebcal__leyning',
        globals: {
          '@hebcal/core': 'hebcal',
        },
        indent: false,
        banner: '/*! ' + pkg.name + ' v' + pkg.version + ' */',
      },
      {
        file: 'dist/bundle.min.js',
        format: 'iife',
        name: 'hebcal__leyning',
        globals: {
          '@hebcal/core': 'hebcal',
        },
        plugins: [terser()],
        banner: '/*! ' + pkg.name + ' v' + pkg.version + ' */',
      },
    ],
    external: ['@hebcal/core'],
    plugins: [
      json({compact: true}),
      babel({
        babelHelpers: 'bundled',
        presets: [
          ['@babel/preset-env', {
            modules: false,
            exclude: ['es.array.sort'],
            targets: {
              edge: '17',
              firefox: '60',
              chrome: '67',
              safari: '11.1',
            },
            useBuiltIns: 'usage',
            corejs: 3,
          }],
        ],
        exclude: ['node_modules/**'],
      }),
      nodeResolve(),
      commonjs(),
    ],
  },
];
