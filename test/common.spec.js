import {calculateNumVerses, parshaToString} from '../src/common';

test('calculateNumVerses', () => {
  expect(calculateNumVerses({k: 'Genesis', b: '1:1', e: '1:1'})).toBe(1);
  expect(calculateNumVerses({k: 'Genesis', b: '1:1', e: '1:2'})).toBe(2);
  expect(calculateNumVerses({k: 'Genesis', b: '1:1', e: '2:3'})).toBe(34);
  expect(calculateNumVerses({k: 'Genesis', b: '2:4', e: '2:19'})).toBe(16);
  expect(calculateNumVerses({k: 'Genesis', b: '2:20', e: '3:21'})).toBe(27);
  expect(calculateNumVerses({k: 'Genesis', b: '3:22', e: '4:18'})).toBe(21);
  expect(calculateNumVerses({k: 'Genesis', b: '1:1', e: '3:21'})).toBe(77);
  expect(calculateNumVerses({k: 'II Kings', b: '12:1', e: '12:17'})).toBe(17);
  expect(calculateNumVerses({k: 'Ezekiel', b: '45:16', e: '46:18'})).toBe(28);
  expect(calculateNumVerses({k: 'Isaiah', b: '54:11', e: '55:5'})).toBe(12);
  expect(calculateNumVerses({k: 'Zechariah', b: '2:14', e: '4:7'})).toBe(21);
  expect(calculateNumVerses({k: 'Ezekiel', b: '1:1', e: '1:28'})).toBe(28);
  expect(calculateNumVerses({k: 'Deuteronomy', b: '5:25', e: '6:3'})).toBe(9);
});

test('parshaToString', () => {
  expect(parshaToString('Bereshit')).toBe('Bereshit');
  expect(parshaToString(['Bereshit'])).toBe('Bereshit');
  expect(parshaToString(['Matot', 'Masei'])).toBe('Matot-Masei');
  expect(parshaToString('Matot-Masei')).toBe('Matot-Masei');
});

test('parshaToString-throws', () => {
  expect(() => {
    parshaToString([]);
  }).toThrow('Bad parsha argument: ');
  expect(() => {
    parshaToString(123);
  }).toThrow('Bad parsha argument: 123');
  expect(() => {
    parshaToString(null);
  }).toThrow('Bad parsha argument: null');
});
