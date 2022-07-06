import test from 'ava';
import {HebrewCalendar, HDate} from '@hebcal/core';
import {Triennial, getTriennialForParshaHaShavua} from './triennial';
import {formatAliyahWithBook} from './common';

test('triennial', (t) => {
  const tri = new Triennial(5777);
  const expected = [
    {
      aliyot: {
        '1': {k: 'Exodus', b: '35:1', e: '35:10', v: 10},
        '2': {k: 'Exodus', b: '35:11', e: '35:20', v: 10},
        '3': {k: 'Exodus', b: '35:21', e: '35:29', v: 9},
        '4': {k: 'Exodus', b: '35:30', e: '36:7', v: 13},
        '5': {k: 'Exodus', b: '36:8', e: '36:19', v: 12},
        '6': {k: 'Exodus', b: '36:20', e: '36:38', v: 19},
        '7': {k: 'Exodus', b: '37:1', e: '37:16', v: 16},
        'M': {k: 'Exodus', b: '37:10', e: '37:16', v: 7},
      },
      date: new HDate(736413),
    },
    {
      aliyot: {
        '1': {k: 'Exodus', b: '37:17', e: '37:24', v: 8},
        '2': {k: 'Exodus', b: '37:25', e: '37:29', v: 5},
        '3': {k: 'Exodus', b: '38:1', e: '38:8', v: 8},
        '4': {k: 'Exodus', b: '38:9', e: '38:20', v: 12},
        '5': {k: 'Exodus', b: '38:21', e: '39:1', v: 12},
        '6': {k: 'Exodus', b: '39:2', e: '39:7', v: 6},
        '7': {k: 'Exodus', b: '39:8', e: '39:21', v: 14},
        'M': {k: 'Exodus', b: '39:19', e: '39:21', v: 3},
      },
      date: new HDate(736763),
    },
    {
      readSeparately: true,
      date1: new HDate(737120),
      date2: new HDate(737127),
    },
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
  t.is(formatAliyahWithBook(reading['2']), 'Leviticus 16:7-16:11');
  t.is(formatAliyahWithBook(reading['7']), 'Leviticus 17:1-17:7');
  t.is(formatAliyahWithBook(reading['M']), 'Leviticus 17:5-17:7');
  ev = events[1];
  t.is(ev.getDesc(), 'Parashat Emor');
  reading = getTriennialForParshaHaShavua(ev);
  t.is(formatAliyahWithBook(reading['1']), 'Leviticus 21:1-21:6');
  t.is(formatAliyahWithBook(reading['M']), 'Leviticus 22:13-22:16');

  options.start = new Date(2022, 3, 29);
  options.end = new Date(2022, 4, 15);
  events = HebrewCalendar.calendar(options);
  ev = events[0];
  t.is(ev.getDesc(), 'Parashat Achrei Mot');
  reading = getTriennialForParshaHaShavua(ev);
  const expected0 = {
    '1': {k: 'Leviticus', b: '17:1', e: '17:7', v: 7},
    '2': {k: 'Leviticus', b: '17:8', e: '17:12', v: 5},
    '3': {k: 'Leviticus', b: '17:13', e: '17:16', v: 4},
    '4': {k: 'Leviticus', b: '18:1', e: '18:5', v: 5},
    '5': {k: 'Leviticus', b: '18:6', e: '18:21', v: 16},
    '6': {k: 'Leviticus', b: '18:22', e: '18:25', v: 4},
    '7': {k: 'Leviticus', b: '18:26', e: '18:30', v: 5},
    'M': {k: 'Leviticus', b: '18:26', e: '18:30', v: 5},
  };
  t.deepEqual(reading, expected0);
  ev = events[1];
  t.is(ev.getDesc(), 'Parashat Kedoshim');
  reading = getTriennialForParshaHaShavua(ev);
  t.is(formatAliyahWithBook(reading['1']), 'Leviticus 19:15-19:18');
  t.is(formatAliyahWithBook(reading['7']), 'Leviticus 20:23-20:27');
  t.is(formatAliyahWithBook(reading['M']), 'Leviticus 20:25-20:27');
  ev = events[2];
  t.is(ev.getDesc(), 'Parashat Emor');
  reading = getTriennialForParshaHaShavua(ev);
  t.is(formatAliyahWithBook(reading['1']), 'Leviticus 23:23-23:25');
  t.is(formatAliyahWithBook(reading['M']), 'Leviticus 24:21-24:23');

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
    '1': {k: 'Genesis', b: '41:1', e: '41:4', v: 4},
    '2': {k: 'Genesis', b: '41:5', e: '41:7', v: 3},
    '3': {k: 'Genesis', b: '41:8', e: '41:14', v: 7},
    '4': {k: 'Genesis', b: '41:15', e: '41:24', v: 10},
    '5': {k: 'Genesis', b: '41:25', e: '41:38', v: 14},
    '6': {k: 'Genesis', b: '41:39', e: '41:43', v: 5},
    '7': {k: 'Genesis', b: '41:44', e: '41:52', v: 9},
    'M': {
      p: 35,
      k: 'Numbers',
      b: '7:48',
      e: '7:59',
      reason: 'Chanukah Day 7',
      v: 12,
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
    '1': {k: 'Exodus', b: '22:4', e: '22:8', v: 5},
    '2': {k: 'Exodus', b: '22:9', e: '22:12', v: 4},
    '3': {k: 'Exodus', b: '22:13', e: '22:18', v: 6},
    '4': {k: 'Exodus', b: '22:19', e: '22:26', v: 8},
    '5': {k: 'Exodus', b: '22:27', e: '23:5', v: 9},
    '6': {k: 'Exodus', b: '23:6', e: '23:19', v: 14},
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
  for (let year = 5744; year <= 6000; year += 3) {
    try {
      const tri = new Triennial(year);
      t.is(typeof tri.getReading('Nitzavim-Vayeilech', 2), 'object');
    } catch (error) {
      t.is(error.message, `Can't find pattern SSS for Vayakhel-Pekudei, startYear=${year}`);
    }
  }
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

test('readSeparately', (t) => {
  const tri = new Triennial(5780);
  t.deepEqual(tri.getReading('Tazria-Metzora', 2), {
    readSeparately: true,
    date1: new HDate(738247),
    date2: new HDate(738254),
  });
});

test('vayeilech-elul', (t) => {
  const options = {
    sedrot: true,
    noHolidays: true,
  };
  options.start = options.end = new Date(2020, 8, 12);
  const event1 = HebrewCalendar.calendar(options)[0];
  t.is(event1.getDesc(), 'Parashat Nitzavim-Vayeilech');
  const reading1 = getTriennialForParshaHaShavua(event1, true);
  t.is(reading1.yearNum, 0);

  options.start = options.end = new Date(2021, 8, 11);
  const event2 = HebrewCalendar.calendar(options)[0];
  t.is(event2.getDesc(), 'Parashat Vayeilech');
  const reading2 = getTriennialForParshaHaShavua(event2, true);
  t.is(reading2.yearNum, 1);

  options.start = options.end = new Date(2022, 9, 1);
  const event3 = HebrewCalendar.calendar(options)[0];
  t.is(event3.getDesc(), 'Parashat Vayeilech');
  const reading3 = getTriennialForParshaHaShavua(event3, true);
  t.is(reading3.yearNum, 2);
});

test('emor-5746', (t) => {
  const options = {
    sedrot: true,
    noHolidays: true,
  };
  // 17 May 1986 (8 Iyyar 5746)
  options.start = options.end = new Date(1986, 4, 17);
  const ev = HebrewCalendar.calendar(options)[0];
  t.is(ev.getDesc(), 'Parashat Emor');
  const reading = getTriennialForParshaHaShavua(ev, true);
  const expected = {
    aliyot: {
      '1': {k: 'Leviticus', b: '23:23', e: '23:25', v: 3},
      '2': {k: 'Leviticus', b: '23:26', e: '23:32', v: 7},
      '3': {k: 'Leviticus', b: '23:33', e: '23:44', v: 12},
      '4': {k: 'Leviticus', b: '24:1', e: '24:4', v: 4},
      '5': {k: 'Leviticus', b: '24:5', e: '24:9', v: 5},
      '6': {k: 'Leviticus', b: '24:10', e: '24:12', v: 3},
      '7': {k: 'Leviticus', b: '24:13', e: '24:23', v: 11},
      'M': {k: 'Leviticus', b: '24:21', e: '24:23', v: 3},
    },
    date: new HDate(options.start),
    yearNum: 2,
    haft: [
      {b: '1:1', e: '1:7', k: 'Nachum', v: 7,
        note: 'Judah shall observe its festivals // complete festival calendar'},
      {b: '2:1', e: '2:3', k: 'Nachum', v: 3},
      {b: '2:2b', e: '2:3a', k: 'Nachum', v: 2},
    ],
    haftara: 'Nachum 1:1-7, 2:1-3, 2:2b-3a',
    haftaraNumV: 12,

  };
  t.deepEqual(reading, expected);
});

test('Vezot Haberakhah', (t) => {
  const tri = new Triennial(5780);
  const reading = tri.getReading('Vezot Haberakhah', 0);
  const expected = {
    aliyot: {
      '1': {k: 'Deuteronomy', b: '33:1', e: '33:7', v: 7},
      '2': {k: 'Deuteronomy', b: '33:8', e: '33:12', v: 5},
      '3': {k: 'Deuteronomy', b: '33:13', e: '33:17', v: 5},
      '4': {k: 'Deuteronomy', b: '33:18', e: '33:21', v: 4},
      '5': {k: 'Deuteronomy', b: '33:22', e: '33:26', v: 5},
      '6': {k: 'Deuteronomy', b: '33:27', e: '33:29', v: 3},
      '7': {k: 'Deuteronomy', b: '34:1', e: '34:12', v: 12},
    },
    date: new HDate(23, 7, 5780),
  };
  t.deepEqual(reading, expected);
});

test('Triennial.debug', (t) => {
  const tri = new Triennial(5781);
  const lines = tri.debug().split('\n');
  const expected = [
    'Triennial cycle started year 5780',
    '  Vayakhel-Pekudei TTS (A)',
    '  Tazria-Metzora TTS (A)',
    '  Achrei Mot-Kedoshim TTS (A)',
    '  Behar-Bechukotai TTS (A)',
    '  Chukat-Balak TSS (C)',
    '  Matot-Masei TTT (Y)',
    '  Nitzavim-Vayeilech TSS (Y)',
    '',
  ];
  t.deepEqual(lines, expected);
  const tri2 = new Triennial(5797);
  const lines2 = tri2.debug().split('\n');
  const expected2 = [
    'Triennial cycle started year 5795',
    '  Vayakhel-Pekudei STT (F)',
    '  Tazria-Metzora STT (C)',
    '  Achrei Mot-Kedoshim STT (C)',
    '  Behar-Bechukotai STT (C)',
    '  Chukat-Balak SSS (G)',
    '  Matot-Masei STT (C)',
    '  Nitzavim-Vayeilech TST (Y)',
    '',
  ];
  t.deepEqual(lines2, expected2);
});

test('multi-year', (t) => {
  for (let hyear = 5782; hyear < 6200; hyear++) {
    if (hyear === 5831 || hyear === 5832 || hyear === 5833 || hyear === 5834) {
      continue;
    }
    const events = HebrewCalendar.calendar({
      year: hyear,
      isHebrewYear: true,
      sedrot: true,
      noHolidays: true,
    });
    for (const ev of events) {
      getTriennialForParshaHaShavua(ev, true);
    }
  }
  t.pass();
});
