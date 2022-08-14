import test from 'ava';
import {HDate} from '@hebcal/core';
import {getLeyningOnDate} from './leyning';

test('getLeyningOnDate-parsha', (t) => {
  const hd = new HDate(16, 'Av', 5782);
  const reading = getLeyningOnDate(hd, false);
  const expected = {
    name: {
      en: 'Vaetchanan',
      he: 'וָאֶתְחַנַּן',
    },
    parsha: [
      'Vaetchanan',
    ],
    parshaNum: 45,
    summary: 'Deuteronomy 3:23-7:11',
    fullkriyah: {
      '1': {k: 'Deuteronomy', b: '3:23', e: '4:4', v: 11},
      '2': {k: 'Deuteronomy', b: '4:5', e: '4:40', v: 36},
      '3': {k: 'Deuteronomy', b: '4:41', e: '4:49', v: 9},
      '4': {k: 'Deuteronomy', b: '5:1', e: '5:18', v: 18},
      '5': {k: 'Deuteronomy', b: '5:19', e: '6:3', v: 15},
      '6': {k: 'Deuteronomy', b: '6:4', e: '6:25', v: 22},
      '7': {k: 'Deuteronomy', b: '7:1', e: '7:11', v: 11},
      'M': {k: 'Deuteronomy', b: '7:9', e: '7:11', v: 3},
    },
    haft: {k: 'Isaiah', b: '40:1', e: '40:26', v: 26},
    haftara: 'Isaiah 40:1-26',
    haftaraNumV: 26,
    weekday: {
      '1': {k: 'Deuteronomy', b: '3:23', e: '3:25', v: 3},
      '2': {k: 'Deuteronomy', b: '3:26', e: '4:4', v: 8},
      '3': {k: 'Deuteronomy', b: '4:5', e: '4:8', v: 4},
    },
  };
  t.deepEqual(reading, expected);
});

test('getLeyningOnDate-holiday1', (t) => {
  const hd = new HDate(2, 'Tishrei', 5783);
  const reading = getLeyningOnDate(hd, false);
  const expected = {
    name: {en: 'Rosh Hashana II', he: 'רֹאשׁ הַשָּׁנָה ב׳'},
    fullkriyah: {
      '1': {p: 4, k: 'Genesis', b: '22:1', e: '22:3', v: 3},
      '2': {p: 4, k: 'Genesis', b: '22:4', e: '22:8', v: 5},
      '3': {p: 4, k: 'Genesis', b: '22:9', e: '22:14', v: 6},
      '4': {p: 4, k: 'Genesis', b: '22:15', e: '22:19', v: 5},
      '5': {p: 4, k: 'Genesis', b: '22:20', e: '22:24', v: 5},
      'M': {p: 41, k: 'Numbers', b: '29:1', e: '29:6', v: 6},
    },
    summary: 'Genesis 22:1-24; Numbers 29:1-6',
    summaryParts: [
      {k: 'Genesis', b: '22:1', e: '22:24'},
      {k: 'Numbers', b: '29:1', e: '29:6'},
    ],
    haft: {k: 'Jeremiah', b: '31:1', e: '31:19', v: 19},
    haftara: 'Jeremiah 31:1-19',
    haftaraNumV: 19,
  };
  t.deepEqual(reading, expected);
});

test('getLeyningOnDate-holiday2', (t) => {
  const hd = new HDate(30, 'Tishrei', 5783);
  const reading = getLeyningOnDate(hd, false);
  const expected = {
    name: {en: 'Rosh Chodesh Cheshvan', he: 'רֹאשׁ חוֹדֶשׁ חֶשְׁוָן'},
    summary: 'Numbers 28:1-15',
    fullkriyah: {
      '1': {p: 41, k: 'Numbers', b: '28:1', e: '28:3', v: 3},
      '2': {p: 41, k: 'Numbers', b: '28:3', e: '28:5', v: 3},
      '3': {p: 41, k: 'Numbers', b: '28:6', e: '28:10', v: 5},
      '4': {p: 41, k: 'Numbers', b: '28:11', e: '28:15', v: 5},
    },
  };
  t.deepEqual(reading, expected);
});

test('getLeyningOnDate-weekday1', (t) => {
  const hd = new HDate(18, 'Av', 5782);
  const reading = getLeyningOnDate(hd, false);
  const expected = {
    name: {en: 'Eikev', he: 'עֵקֶב'},
    parsha: ['Eikev'],
    parshaNum: 46,
    weekday: {
      '1': {k: 'Deuteronomy', b: '7:12', e: '7:21', v: 10},
      '2': {k: 'Deuteronomy', b: '7:22', e: '8:3', v: 8},
      '3': {k: 'Deuteronomy', b: '8:4', e: '8:10', v: 7},
    },
  };
  t.deepEqual(reading, expected);
});

test('getLeyningOnDate-weekday2', (t) => {
  const hd = new HDate(23, 'Adar', 5783);
  const reading = getLeyningOnDate(hd, false);
  const expected = {
    name: {en: 'Vayakhel-Pekudei', he: 'וַיַּקְהֵל־פְקוּדֵי'},
    parsha: ['Vayakhel', 'Pekudei'],
    parshaNum: 101,
    weekday: {
      '1': {k: 'Exodus', b: '35:1', e: '35:3', v: 3},
      '2': {k: 'Exodus', b: '35:4', e: '35:10', v: 7},
      '3': {k: 'Exodus', b: '35:11', e: '35:20', v: 10},
    },
  };
  t.deepEqual(reading, expected);
});
