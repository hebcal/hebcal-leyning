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

test('lookupParsha-Hebrew', () => {
  const meta = lookupParsha('Bereshit', 'he');
  expect(meta.num).toBe(1);
  expect(meta.hebrew).toBe('בְּרֵאשִׁית');
  expect(meta.book).toBe(1);
  expect(meta.haft.k).toBe('יְשַׁעְיָהוּ');
  expect(meta.haft.b).toBe('מ״ב:ה׳');
  expect(meta.haft.e).toBe('מ״ג:י׳');
  expect(meta.seph.k).toBe('יְשַׁעְיָהוּ');
  expect(meta.seph.b).toBe('מ״ב:ה׳');
  expect(meta.seph.e).toBe('מ״ב:כ״א');
  // Verify fullkriyah structure is unchanged
  expect(meta.fullkriyah['1']).toEqual(['1:1', '2:3']);
  expect(meta.fullkriyah['7']).toEqual(['5:25', '6:8']);
});

test('lookupParsha-Hebrew-combined', () => {
  const meta = lookupParsha(['Tazria', 'Metzora'], 'he');
  expect(meta.hebrew).toBe('תַזְרִיעַ־מְצֹרָע');
  expect(meta.num).toEqual([27, 28]);
  expect(meta.combined).toBe(true);
  expect(meta.p1).toBe('Tazria');
  expect(meta.p2).toBe('Metzora');
  expect(meta.book).toBe(3);
  expect(meta.haft.k).toBe('מְלָכִים ב');
  expect(meta.haft.b).toBe('ז׳:ג׳');
  expect(meta.haft.e).toBe('ז׳:כ׳');
  // Verify fullkriyah structure is unchanged
  expect(meta.fullkriyah['1']).toEqual(['12:1', '13:23']);
  expect(meta.fullkriyah['M']).toEqual(['15:31', '15:33']);
});

test('lookupParsha-Hebrew-with-sephardic', () => {
  const meta = lookupParsha('Vayakhel', 'he');
  expect(meta.hebrew).toBe('וַיַּקְהֵל');
  expect(meta.haft.k).toBe('מְלָכִים א');
  expect(meta.haft.b).toBe('ז׳:מ׳');
  expect(meta.haft.e).toBe('ז׳:נ׳');
  expect(meta.seph.k).toBe('מְלָכִים א');
  expect(meta.seph.b).toBe('ז׳:י״ג');
  expect(meta.seph.e).toBe('ז׳:כ״ו');
});