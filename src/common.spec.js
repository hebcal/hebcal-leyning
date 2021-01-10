import {HDate, ParshaEvent} from '@hebcal/core';
import test from 'ava';
import {addSefariaLinksToLeyning} from './common';
import {getLeyningForHolidayKey} from './leyning';
import {getTriennialForParshaHaShavua} from './triennial';

test('addSefariaLinksToLeyning-holiday', (t) => {
  const reading = getLeyningForHolidayKey('Rosh Hashana II');
  const original = {
    '1': {p: 4, k: 'Genesis', b: '22:1', e: '22:3'},
    '2': {p: 4, k: 'Genesis', b: '22:4', e: '22:8'},
    '3': {p: 4, k: 'Genesis', b: '22:9', e: '22:14'},
    '4': {p: 4, k: 'Genesis', b: '22:15', e: '22:19'},
    '5': {p: 4, k: 'Genesis', b: '22:20', e: '22:24'},
    'M': {p: 41, k: 'Numbers', b: '29:1', e: '29:6', v: 6},
  };
  t.deepEqual(reading.fullkriyah, original, 'original aliyot');

  addSefariaLinksToLeyning(reading.fullkriyah, true);
  const expected = {
    '1': {
      p: 4,
      k: 'Genesis',
      b: '22:1',
      e: '22:3',
      num: '1',
      verses: 'Genesis 22:1-3',
      href: 'https://www.sefaria.org/Genesis.22.1-3?lang=bi&aliyot=0',
    },
    '2': {
      p: 4,
      k: 'Genesis',
      b: '22:4',
      e: '22:8',
      num: '2',
      verses: 'Genesis 22:4-8',
      href: 'https://www.sefaria.org/Genesis.22.4-8?lang=bi&aliyot=0',
    },
    '3': {
      p: 4,
      k: 'Genesis',
      b: '22:9',
      e: '22:14',
      num: '3',
      verses: 'Genesis 22:9-14',
      href: 'https://www.sefaria.org/Genesis.22.9-14?lang=bi&aliyot=0',
    },
    '4': {
      p: 4,
      k: 'Genesis',
      b: '22:15',
      e: '22:19',
      num: '4',
      verses: 'Genesis 22:15-19',
      href: 'https://www.sefaria.org/Genesis.22.15-19?lang=bi&aliyot=0',
    },
    '5': {
      p: 4,
      k: 'Genesis',
      b: '22:20',
      e: '22:24',
      num: '5',
      verses: 'Genesis 22:20-24',
      href: 'https://www.sefaria.org/Genesis.22.20-24?lang=bi&aliyot=0',
    },
    'M': {
      p: 41,
      k: 'Numbers',
      b: '29:1',
      e: '29:6',
      v: 6,
      num: 'maf',
      verses: 'Numbers 29:1-6',
      href: 'https://www.sefaria.org/Numbers.29.1-6?lang=bi&aliyot=0',
    },
  }
  ;
  t.deepEqual(reading.fullkriyah, expected, 'modified aliyot');
});

test('addSefariaLinksToLeyning-triennial', (t) => {
  const hd = new HDate(26, 'Tishrei', 5782);
  const ev = new ParshaEvent(hd, ['Bereshit']);
  const reading = getTriennialForParshaHaShavua(ev, true);
  const original = {
    '1': {k: 'Genesis', b: '5:1', e: '5:5', v: 5},
    '2': {k: 'Genesis', b: '5:6', e: '5:8', v: 3},
    '3': {k: 'Genesis', b: '5:9', e: '5:14', v: 6},
    '4': {k: 'Genesis', b: '5:15', e: '5:20', v: 6},
    '5': {k: 'Genesis', b: '5:21', e: '5:24', v: 4},
    '6': {k: 'Genesis', b: '5:25', e: '5:31', v: 7},
    '7': {k: 'Genesis', b: '5:32', e: '6:8'},
    'M': {k: 'Genesis', b: '6:5', e: '6:8', v: 4},
  };
  t.deepEqual(reading.aliyot, original);
  addSefariaLinksToLeyning(reading.aliyot, false);
  const expected = {
    '1': {
      k: 'Genesis',
      b: '5:1',
      e: '5:5',
      v: 5,
      num: '1',
      verses: '5:1-5',
      href: 'https://www.sefaria.org/Genesis.5.1-5?lang=bi&aliyot=1',
    },
    '2': {
      k: 'Genesis',
      b: '5:6',
      e: '5:8',
      v: 3,
      num: '2',
      verses: '5:6-8',
      href: 'https://www.sefaria.org/Genesis.5.6-8?lang=bi&aliyot=1',
    },
    '3': {
      k: 'Genesis',
      b: '5:9',
      e: '5:14',
      v: 6,
      num: '3',
      verses: '5:9-14',
      href: 'https://www.sefaria.org/Genesis.5.9-14?lang=bi&aliyot=1',
    },
    '4': {
      k: 'Genesis',
      b: '5:15',
      e: '5:20',
      v: 6,
      num: '4',
      verses: '5:15-20',
      href: 'https://www.sefaria.org/Genesis.5.15-20?lang=bi&aliyot=1',
    },
    '5': {
      k: 'Genesis',
      b: '5:21',
      e: '5:24',
      v: 4,
      num: '5',
      verses: '5:21-24',
      href: 'https://www.sefaria.org/Genesis.5.21-24?lang=bi&aliyot=1',
    },
    '6': {
      k: 'Genesis',
      b: '5:25',
      e: '5:31',
      v: 7,
      num: '6',
      verses: '5:25-31',
      href: 'https://www.sefaria.org/Genesis.5.25-31?lang=bi&aliyot=1',
    },
    '7': {
      k: 'Genesis',
      b: '5:32',
      e: '6:8',
      num: '7',
      verses: '5:32-6:8',
      href: 'https://www.sefaria.org/Genesis.5.32-6.8?lang=bi&aliyot=1',
    },
    'M': {
      k: 'Genesis',
      b: '6:5',
      e: '6:8',
      v: 4,
      num: 'maf',
      verses: '6:5-8',
      href: 'https://www.sefaria.org/Genesis.6.5-8?lang=bi&aliyot=1',
    },
  };
  t.deepEqual(reading.aliyot, expected);
});
