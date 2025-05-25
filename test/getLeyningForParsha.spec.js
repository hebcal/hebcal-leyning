import {expect, test} from 'vitest';
import {parshiot} from '@hebcal/core';
import {getLeyningForParsha} from '../src/leyning';

test('getLeyningForParsha-1', () => {
  const reading = getLeyningForParsha('Pinchas');
  const expected = {
    name: {
      en: 'Pinchas',
      he: 'פִּינְחָס',
    },
    type: 'shabbat',
    parsha: [
      'Pinchas',
    ],
    parshaNum: 41,
    summary: 'Numbers 25:10-30:1',
    fullkriyah: {
      '1': {k: 'Numbers', b: '25:10', e: '26:4', v: 14},
      '2': {k: 'Numbers', b: '26:5', e: '26:51', v: 47},
      '3': {k: 'Numbers', b: '26:52', e: '27:5', v: 19},
      '4': {k: 'Numbers', b: '27:6', e: '27:23', v: 18},
      '5': {k: 'Numbers', b: '28:1', e: '28:15', v: 15},
      '6': {k: 'Numbers', b: '28:16', e: '29:11', v: 27},
      '7': {k: 'Numbers', b: '29:12', e: '30:1', v: 29},
      'M': {k: 'Numbers', b: '29:35', e: '30:1', v: 6},
    },
    haft: {
      b: '18:46',
      e: '19:21',
      k: 'I Kings',
      v: 22,
    },
    haftara: 'I Kings 18:46-19:21',
    haftaraNumV: 22,
    weekday: {
      '1': {k: 'Numbers', b: '25:10', e: '25:12', v: 3},
      '2': {k: 'Numbers', b: '25:13', e: '25:15', v: 3},
      '3': {k: 'Numbers', b: '25:16', e: '26:4', v: 8},
    },
  };
  expect(reading).toEqual(expected);
});

test('getLeyningForParsha-2', () => {
  const reading2 = getLeyningForParsha(['Matot', 'Masei']);
  const expected2 = {
    name: {
      en: 'Matot-Masei',
      he: 'מַּטּוֹת־מַסְעֵי',
    },
    type: 'shabbat',
    parsha: [
      'Matot',
      'Masei',
    ],
    parshaNum: [42, 43],
    summary: 'Numbers 30:2-36:13',
    fullkriyah: {
      '1': {k: 'Numbers', b: '30:2', e: '31:12', v: 28},
      '2': {k: 'Numbers', b: '31:13', e: '31:54', v: 42},
      '3': {k: 'Numbers', b: '32:1', e: '32:19', v: 19},
      '4': {k: 'Numbers', b: '32:20', e: '33:49', v: 72},
      '5': {k: 'Numbers', b: '33:50', e: '34:15', v: 22},
      '6': {k: 'Numbers', b: '34:16', e: '35:8', v: 22},
      '7': {k: 'Numbers', b: '35:9', e: '36:13', v: 39},
      'M': {k: 'Numbers', b: '36:11', e: '36:13', v: 3},
    },
    haft: [{
      k: 'Jeremiah',
      b: '2:4',
      e: '2:28',
      v: 25,
    }, {
      k: 'Jeremiah',
      b: '3:4',
      e: '3:4',
      v: 1,
    }],
    seph: [
      {
        b: '2:4',
        e: '2:28',
        k: 'Jeremiah',
        v: 25,
      },
      {
        b: '4:1',
        e: '4:2',
        k: 'Jeremiah',
        v: 2,
      },
    ],
    sephardic: 'Jeremiah 2:4-28, 4:1-2',
    sephardicNumV: 27,
    haftara: 'Jeremiah 2:4-28, 3:4',
    haftaraNumV: 26,
    weekday: {
      '1': {k: 'Numbers', b: '30:2', e: '30:9', v: 8},
      '2': {k: 'Numbers', b: '30:10', e: '30:13', v: 4},
      '3': {k: 'Numbers', b: '30:14', e: '30:17', v: 4},
    },
  };
  expect(reading2).toEqual(expected2);

  const reading2b = getLeyningForParsha('Matot-Masei');
  expect(reading2).toEqual(reading2b);
});

test('getLeyningForParsha-3', () => {
  const reading3 = getLeyningForParsha(['Masei']);
  const expected3 = {
    name: {
      en: 'Masei',
      he: 'מַסְעֵי',
    },
    type: 'shabbat',
    parsha: [
      'Masei',
    ],
    parshaNum: 43,
    summary: 'Numbers 33:1-36:13',
    fullkriyah: {
      '1': {k: 'Numbers', b: '33:1', e: '33:10', v: 10},
      '2': {k: 'Numbers', b: '33:11', e: '33:49', v: 39},
      '3': {k: 'Numbers', b: '33:50', e: '34:15', v: 22},
      '4': {k: 'Numbers', b: '34:16', e: '34:29', v: 14},
      '5': {k: 'Numbers', b: '35:1', e: '35:8', v: 8},
      '6': {k: 'Numbers', b: '35:9', e: '35:34', v: 26},
      '7': {k: 'Numbers', b: '36:1', e: '36:13', v: 13},
      'M': {k: 'Numbers', b: '36:11', e: '36:13', v: 3},
    },
    haft: [{
      k: 'Jeremiah',
      b: '2:4',
      e: '2:28',
      v: 25,
    }, {
      k: 'Jeremiah',
      b: '3:4',
      e: '3:4',
      v: 1,
    }],
    haftara: 'Jeremiah 2:4-28, 3:4',
    haftaraNumV: 26,
    seph: [{
      b: '2:4',
      e: '2:28',
      k: 'Jeremiah',
      v: 25,
    }, {
      b: '4:1',
      e: '4:2',
      k: 'Jeremiah',
      v: 2,
    }],
    sephardic: 'Jeremiah 2:4-28, 4:1-2',
    sephardicNumV: 27,
    weekday: {
      '1': {k: 'Numbers', b: '33:1', e: '33:3', v: 3},
      '2': {k: 'Numbers', b: '33:4', e: '33:6', v: 3},
      '3': {k: 'Numbers', b: '33:7', e: '33:10', v: 4},
    },
  };
  expect(reading3).toEqual(expected3);
});

test('no-aliyot-lessthan-three', () => {
  const toTest = [].concat(parshiot, [
    'Vayakhel-Pekudei',
    'Tazria-Metzora',
    'Achrei Mot-Kedoshim',
    'Behar-Bechukotai',
    'Chukat-Balak',
    'Matot-Masei',
    'Nitzavim-Vayeilech',
  ]);
  for (const parsha of toTest) {
    const reading = getLeyningForParsha(parsha);
    for (const aliyah of Object.values(reading.fullkriyah)) {
      expect(aliyah.v).toBeGreaterThanOrEqual(3);
    }
    for (const aliyah of Object.values(reading.weekday)) {
      expect(aliyah.v).toBeGreaterThanOrEqual(3);
    }
  }
});
