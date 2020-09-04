import test from 'ava';
import {HebrewCalendar, HDate} from '@hebcal/core';
import {Triennial, getTriennialForParshaHaShavua} from './triennial';
import {formatAliyahWithBook} from './leyning';

test('triennial', (t) => {
  const tri = new Triennial(5777);
  const expected = [
    {
      aliyot: {
        '1': {k: 'Exodus', b: '35:1', e: '35:10'},
        '2': {k: 'Exodus', b: '35:11', e: '35:20'},
        '3': {k: 'Exodus', b: '35:21', e: '35:29'},
        '4': {k: 'Exodus', b: '35:30', e: '36:7'},
        '5': {k: 'Exodus', b: '36:8', e: '36:19'},
        '6': {k: 'Exodus', b: '36:20', e: '36:38'},
        '7': {k: 'Exodus', b: '37:1', e: '37:16'},
        'M': {k: 'Exodus', b: '37:10', e: '37:16'},
      },
      date: new HDate(736413),
    },
    {
      aliyot: {
        '1': {k: 'Exodus', b: '37:17', e: '37:24'},
        '2': {k: 'Exodus', b: '37:25', e: '37:29'},
        '3': {k: 'Exodus', b: '38:1', e: '38:8'},
        '4': {k: 'Exodus', b: '38:9', e: '38:20'},
        '5': {k: 'Exodus', b: '38:21', e: '39:1'},
        '6': {k: 'Exodus', b: '39:2', e: '39:7'},
        '7': {k: 'Exodus', b: '39:8', e: '39:21'},
        'M': {k: 'Exodus', b: '39:19', e: '39:21'},
      },
      date: new HDate(736763),
    },
    undefined,
  ];
  for (let i = 0; i < 3; i++) {
    t.deepEqual(tri.getReading('Vayakhel-Pekudei', i), expected[i]);
  }
});

test('getTriennialForParshaHaShavua', (t) => {
  const options = {
    start: new Date(2020, 4, 1),
    end: new Date(2020, 4, 10),
    sedrot: true,
    noHolidays: true,
  };
  let events = HebrewCalendar.calendar(options);
  let ev = events[0];
  t.is(ev.getDesc(), 'Parashat Achrei Mot-Kedoshim');
  let reading = getTriennialForParshaHaShavua(ev);
  t.is(formatAliyahWithBook(reading['2']), 'Leviticus 16:7 - 16:11');
  t.is(formatAliyahWithBook(reading['7']), 'Leviticus 17:1 - 17:7');
  t.is(formatAliyahWithBook(reading['M']), 'Leviticus 17:5 - 17:7');
  ev = events[1];
  t.is(ev.getDesc(), 'Parashat Emor');
  reading = getTriennialForParshaHaShavua(ev);
  t.is(formatAliyahWithBook(reading['1']), 'Leviticus 21:1 - 21:6');
  t.is(formatAliyahWithBook(reading['M']), 'Leviticus 22:13 - 22:16');

  options.start = new Date(2022, 3, 29);
  options.end = new Date(2022, 4, 15);
  events = HebrewCalendar.calendar(options);
  ev = events[0];
  t.is(ev.getDesc(), 'Parashat Achrei Mot');
  reading = getTriennialForParshaHaShavua(ev);
  t.is(formatAliyahWithBook(reading['2']), 'Leviticus 16:4 - 16:6');
  t.is(formatAliyahWithBook(reading['7']), 'Leviticus 16:31 - 16:34');
  t.is(formatAliyahWithBook(reading['M']), 'Leviticus 16:31 - 16:34');
  ev = events[1];
  t.is(ev.getDesc(), 'Parashat Kedoshim');
  reading = getTriennialForParshaHaShavua(ev);
  t.is(formatAliyahWithBook(reading['1']), 'Leviticus 19:15 - 19:18');
  t.is(formatAliyahWithBook(reading['7']), 'Leviticus 20:23 - 20:27');
  t.is(formatAliyahWithBook(reading['M']), 'Leviticus 20:25 - 20:27');
  ev = events[2];
  t.is(ev.getDesc(), 'Parashat Emor');
  reading = getTriennialForParshaHaShavua(ev);
  t.is(formatAliyahWithBook(reading['1']), 'Leviticus 23:23 - 23:25');
  t.is(formatAliyahWithBook(reading['M']), 'Leviticus 24:21 - 24:23');

  options.start = new Date(2022, 9, 1);
  options.end = new Date(2022, 9, 1);
  events = HebrewCalendar.calendar(options);
  ev = events[0];
  t.is(ev.getDesc(), 'Parashat Vayeilech');
  reading = getTriennialForParshaHaShavua(ev);
  const expected = {
    '1': {k: 'Deuteronomy', b: '31:1', e: '31:3', v: 3},
    '2': {k: 'Deuteronomy', b: '31:4', e: '31:6', v: 3},
    '3': {k: 'Deuteronomy', b: '31:7', e: '31:9', v: 3},
    '4': {k: 'Deuteronomy', b: '31:10', e: '31:13', v: 4},
    '5': {k: 'Deuteronomy', b: '31:14', e: '31:19', v: 6},
    '6': {k: 'Deuteronomy', b: '31:20', e: '31:24', v: 5},
    '7': {k: 'Deuteronomy', b: '31:25', e: '31:30', v: 6},
    'M': {k: 'Deuteronomy', b: '31:28', e: '31:30', v: 3},
  };
  t.deepEqual(reading, expected, 'Vayeilech');
});

test('specialReading1', (t) => {
  const options = {
    start: new Date(2016, 11, 31),
    end: new Date(2017, 0, 1),
    sedrot: true,
    noHolidays: true,
  };
  const events = HebrewCalendar.calendar(options);
  const ev = events[0];
  t.is(ev.getDesc(), 'Parashat Miketz');
  const reading = getTriennialForParshaHaShavua(ev);
  const expected = {
    '1': {k: 'Genesis', b: '41:1', e: '41:4'},
    '2': {k: 'Genesis', b: '41:5', e: '41:7'},
    '3': {k: 'Genesis', b: '41:8', e: '41:14'},
    '4': {k: 'Genesis', b: '41:15', e: '41:24'},
    '5': {k: 'Genesis', b: '41:25', e: '41:38'},
    '6': {k: 'Genesis', b: '41:39', e: '41:43'},
    '7': {k: 'Genesis', b: '41:44', e: '41:52'},
    'M': {
      p: 35,
      k: 'Numbers',
      b: '7:48',
      e: '7:59',
      reason: 'Chanukah (Day 7)',
    },
  };
  t.deepEqual(reading, expected);
});

test('specialReading2', (t) => {
  const options = {
    start: new Date(2021, 1, 13),
    end: new Date(2021, 1, 13),
    sedrot: true,
    noHolidays: true,
  };
  const events = HebrewCalendar.calendar(options);
  const ev = events[0];
  t.is(ev.getDesc(), 'Parashat Mishpatim');
  const reading = getTriennialForParshaHaShavua(ev);
  const expected = {
    '1': {k: 'Exodus', b: '22:4', e: '22:8'},
    '2': {k: 'Exodus', b: '22:9', e: '22:12'},
    '3': {k: 'Exodus', b: '22:13', e: '22:18'},
    '4': {k: 'Exodus', b: '22:19', e: '22:26'},
    '5': {k: 'Exodus', b: '22:27', e: '23:5'},
    '6': {k: 'Exodus', b: '23:6', e: '23:19'},
    '7': {
      p: 41,
      k: 'Numbers',
      b: '28:9',
      e: '28:15',
      v: 7,
      reason: 'Shabbat Shekalim (on Rosh Chodesh)',
    },
    'M': {
      p: 21,
      k: 'Exodus',
      b: '30:11',
      e: '30:16',
      v: 6,
      reason: 'Shabbat Shekalim (on Rosh Chodesh)',
    },
  };
  t.deepEqual(reading, expected);
});

test('multi', (t) => {
  for (let year = 5745; year <= 5830; year += 3) {
    const tri = new Triennial(year);
    tri.getReading('Vayakhel-Pekudei', 2);
  }
  t.pass('5745-5830 passed');
});

test('readTogether', (t) => {
  const tri = new Triennial(5780);
  t.deepEqual(tri.getReading('Tazria', 0), {
    readTogether: 'Tazria-Metzora',
    date: new HDate(737540),
  });
  t.deepEqual(tri.getReading('Tazria', 1), {
    readTogether: 'Tazria-Metzora',
    date: new HDate(737897),
  });
});
