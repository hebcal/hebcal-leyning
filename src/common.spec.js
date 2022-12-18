import test from 'ava';
import {calculateNumVerses, parshaToString} from './common';

test('calculateNumVerses', (t) => {
  t.is(calculateNumVerses({k: 'Genesis', b: '1:1', e: '1:1'}), 1);
  t.is(calculateNumVerses({k: 'Genesis', b: '1:1', e: '1:2'}), 2);
  t.is(calculateNumVerses({k: 'Genesis', b: '1:1', e: '2:3'}), 34);
  t.is(calculateNumVerses({k: 'Genesis', b: '2:4', e: '2:19'}), 16);
  t.is(calculateNumVerses({k: 'Genesis', b: '2:20', e: '3:21'}), 27);
  t.is(calculateNumVerses({k: 'Genesis', b: '3:22', e: '4:18'}), 21);
  t.is(calculateNumVerses({k: 'Genesis', b: '1:1', e: '3:21'}), 77);
  t.is(calculateNumVerses({k: 'II Kings', b: '12:1', e: '12:17'}), 17);
  t.is(calculateNumVerses({k: 'Ezekiel', b: '45:16', e: '46:18'}), 28);
  t.is(calculateNumVerses({k: 'Isaiah', b: '54:11', e: '55:5'}), 12);
  t.is(calculateNumVerses({k: 'Zechariah', b: '2:14', e: '4:7'}), 21);
  t.is(calculateNumVerses({k: 'Ezekiel', b: '1:1', e: '1:28'}), 28);
  t.is(calculateNumVerses({k: 'Deuteronomy', b: '5:25', e: '6:3'}), 9);
});

test('parshaToString', (t) => {
  t.is(parshaToString('Bereshit'), 'Bereshit');
  t.is(parshaToString(['Bereshit']), 'Bereshit');
  t.is(parshaToString(['Matot', 'Masei']), 'Matot-Masei');
  t.is(parshaToString('Matot-Masei'), 'Matot-Masei');
});

test('parshaToString-throws', (t) => {
  const error = t.throws(() => {
    parshaToString([]);
  }, {instanceOf: TypeError});
  t.is(error.message, 'Bad parsha argument: ');
  const error2 = t.throws(() => {
    parshaToString(123);
  }, {instanceOf: TypeError});
  t.is(error2.message, 'Bad parsha argument: 123');
  const error3 = t.throws(() => {
    parshaToString(null);
  }, {instanceOf: TypeError});
  t.is(error3.message, 'Bad parsha argument: null');
});
