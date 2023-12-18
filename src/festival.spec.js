import test from 'ava';
import {hasFestival, lookupFestival} from './festival.js';

test('lookupFestival-fk', (t) => {
  const src = lookupFestival('Pesach VIII');
  const expected = {
    haft: {k: 'Isaiah', b: '10:32', e: '12:6'},
    fullkriyah: {
      '1': {p: 47, k: 'Deuteronomy', b: '15:19', e: '15:23'},
      '2': {p: 47, k: 'Deuteronomy', b: '16:1', e: '16:3'},
      '3': {p: 47, k: 'Deuteronomy', b: '16:4', e: '16:8'},
      '4': {p: 47, k: 'Deuteronomy', b: '16:9', e: '16:12'},
      '5': {p: 47, k: 'Deuteronomy', b: '16:13', e: '16:17'},
      'M': {p: 41, k: 'Numbers', b: '28:19', e: '28:25'},
    },
  };
  t.deepEqual(src, expected);
});

test('lookupFestival-alias', (t) => {
  const src = lookupFestival('Asara B\'Tevet');
  const expected = {
    fullkriyah: {
      '1': {p: 21, k: 'Exodus', b: '32:11', e: '32:14'},
      '2': {p: 21, k: 'Exodus', b: '34:1', e: '34:3'},
      '3': {p: 21, k: 'Exodus', b: '34:4', e: '34:10'},
    },
  };
  t.deepEqual(src, expected);
});

test('lookupFestival-note', (t) => {
  const src = lookupFestival('Shushan Purim');
  t.is(src.note, 'Jerusalem & walled cities only');
});

test('hasFestival', (t) => {
  t.is(hasFestival('Foo'), false);
  t.is(hasFestival('Shavuot'), true);
});
