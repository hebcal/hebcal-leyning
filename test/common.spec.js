import {expect, test} from 'vitest';
import {
  addVerses,
  calculateNumVerses,
  parshaToString,
  subtractVerses,
} from '../src/common';

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

test('subtractVerses', () => {
  expect(subtractVerses('Genesis', '1:1', '1:1')).toBe(0);
  expect(subtractVerses('Genesis', '1:1', '1:2')).toBe(1);
  expect(subtractVerses('Genesis', '1:1', '2:3')).toBe(33);
  expect(subtractVerses('Genesis', '2:4', '2:19')).toBe(15);
  expect(subtractVerses('Genesis', '2:20', '3:21')).toBe(26);
  expect(subtractVerses('Genesis', '3:22', '4:18')).toBe(20);
  expect(subtractVerses('Genesis', '1:1', '3:21')).toBe(76);
  expect(subtractVerses('II Kings', '12:1', '12:17')).toBe(16);
  expect(subtractVerses('Ezekiel', '45:16', '46:18')).toBe(27);
  expect(subtractVerses('Isaiah', '54:11', '55:5')).toBe(11);
  expect(subtractVerses('Zechariah', '2:14', '4:7')).toBe(20);
  expect(subtractVerses('Ezekiel', '1:1', '1:28')).toBe(27);
  expect(subtractVerses('Deuteronomy', '5:25', '6:3')).toBe(8);
});

test('addVerses', () => {
  expect(addVerses('Genesis', '1:1', 0)).toBe('1:1');
  expect(addVerses('Genesis', '1:1', 1)).toBe('1:2');
  expect(addVerses('Genesis', '1:1', 33)).toBe('2:3');
  expect(addVerses('Genesis', '2:4', 15)).toBe('2:19');
  expect(addVerses('Genesis', '2:20', 26)).toBe('3:21');
  expect(addVerses('Genesis', '3:22', 20)).toBe('4:18');
  expect(addVerses('Genesis', '1:1', 76)).toBe('3:21');
  expect(addVerses('II Kings', '12:1', 16)).toBe('12:17');
  expect(addVerses('Ezekiel', '45:16', 27)).toBe('46:18');
  expect(addVerses('Isaiah', '54:11', 11)).toBe('55:5');
  expect(addVerses('Zechariah', '2:14', 20)).toBe('4:7');
  expect(addVerses('Ezekiel', '1:1', 27)).toBe('1:28');
  expect(addVerses('Deuteronomy', '5:25', 8)).toBe('6:3');
  expect(addVerses('Deuteronomy', '5:25', 999)).toBeNull();
});

test('add and subtract', () => {
  const book = 'Genesis';
  const start = '1:1';
  for (let i = 0; i < 100; i++) {
    const end = addVerses(book, start, i);
    const diff = subtractVerses(book, start, end);
    expect(diff).toBe(i);
  }
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
