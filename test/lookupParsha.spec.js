import {expect, test} from 'vitest';
import {lookupParsha} from '../src/leyning';

test('lookupParsha', () => {
  const meta = lookupParsha('Bereshit');
  const expected = {
    'num': 1,
    'hebrew': 'בְּרֵאשִׁית',
    'book': 1,
    'haft': {'k': 'Isaiah', 'b': '42:5', 'e': '43:10'},
    'seph': {'k': 'Isaiah', 'b': '42:5', 'e': '42:21'},
    'fullkriyah': {
      '1': ['1:1', '2:3'],
      '2': ['2:4', '2:19'],
      '3': ['2:20', '3:21'],
      '4': ['3:22', '4:18'],
      '5': ['4:19', '4:22', 'some sources use 4:19-26'],
      '6': ['4:23', '5:24', 'some sources use 5:1-24'],
      '7': ['5:25', '6:8'],
      'M': ['6:5', '6:8']},
    'weekday': {
      '1': ['1:1', '1:5'],
      '2': ['1:6', '1:8'],
      '3': ['1:9', '1:13'],
    },
  };
  expect(meta).toEqual(expected);
});

test('lookupParsha-combined', () => {
  const meta = lookupParsha(['Tazria', 'Metzora']);
  const expected = {
    "hebrew": "תַזְרִיעַ־מְצֹרָע",
    'num': [27, 28],
    'combined': true,
    'p1': 'Tazria',
    'p2': 'Metzora',
    'num1': 27,
    'num2': 28,
    'book': 3,
    'haft': {
      'b': '7:3',
      'e': '7:20',
      'k': 'II Kings',
    },
    'fullkriyah': {
      '1': ['12:1', '13:23'],
      '2': ['13:24', '13:39'],
      '3': ['13:40', '13:54'],
      '4': ['13:55', '14:20'],
      '5': ['14:21', '14:32'],
      '6': ['14:33', '15:15'],
      '7': ['15:16', '15:33'],
      'M': ['15:31', '15:33']},
  };
  expect(meta).toEqual(expected);
});

test('throws', () => {
  expect(() => {
    lookupParsha('Bogus');
  }).toThrow('Bad parsha argument: Bogus');
});
