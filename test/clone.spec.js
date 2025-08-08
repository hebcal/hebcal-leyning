import {expect, test} from 'vitest';
import {clone, cloneHaftara, sumVerses} from '../src/clone';

test('clone', () => {
  const src = {a: 1, b: {c: 2}};
  const dest = clone(src);
  expect(dest).toEqual(src);
  expect(dest).not.toBe(src);
  expect(dest.b).not.toBe(src.b);
});

test('cloneHaftara', () => {
  const haft = {k: 'Isaiah', b: '1:1', e: '1:26'};
  const dest = cloneHaftara(haft);
  expect(dest).toEqual({k: 'Isaiah', b: '1:1', e: '1:26', v: 26});
  expect(dest).not.toBe(haft);
});

test('cloneHaftara array', () => {
  const haft = [
    {k: 'Isaiah', b: '1:1', e: '1:26'},
    {k: 'Jeremiah', b: '2:4', e: '2:28'},
  ];
  const dest = cloneHaftara(haft);
  expect(dest).toEqual([
    {k: 'Isaiah', b: '1:1', e: '1:26', v: 26},
    {k: 'Jeremiah', b: '2:4', e: '2:28', v: 25},
  ]);
  expect(dest).not.toBe(haft);
});

test('sumVerses', () => {
  const haft = [
    {k: 'Isaiah', b: '1:1', e: '1:26', v: 26},
    {k: 'Jeremiah', b: '2:4', e: '2:28', v: 25},
  ];
  expect(sumVerses(haft)).toBe(51);
});

test('sumVerses single', () => {
  const haft = {k: 'Isaiah', b: '1:1', e: '1:26', v: 26};
  expect(sumVerses(haft)).toBe(26);
});
