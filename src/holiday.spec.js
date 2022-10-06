import test from 'ava';
import {HDate, HebrewCalendar, Event, months, flags} from '@hebcal/core';
import {getLeyningForHoliday, getLeyningForHolidayKey} from './leyning';
import {getLeyningKeyForEvent} from './getLeyningKeyForEvent';
import {formatAliyahWithBook} from './common';


test('pesach-il', (t) => {
  const events0 = HebrewCalendar.calendar({year: 5782, isHebrewYear: true, il: true});
  const events = events0.filter((ev) => ev.basename() === 'Pesach');
  const actual = [];
  for (const ev of events) {
    const reading = getLeyningForHoliday(ev, true);
    actual.push({
      h: ev.getDesc(),
      s: reading && reading.summary,
    });
  }
  const expected = [
    {h: 'Erev Pesach', s: undefined},
    {h: 'Pesach I', s: 'Exodus 12:21-51; Numbers 28:16-25'},
    {h: 'Pesach II (CH\'\'M)', s: 'Leviticus 22:26-23:44; Numbers 28:19-25'},
    {h: 'Pesach III (CH\'\'M)', s: 'Exodus 13:1-16; Numbers 28:19-25'},
    {h: 'Pesach IV (CH\'\'M)', s: 'Exodus 22:24-23:19; Numbers 28:19-25'},
    {h: 'Pesach V (CH\'\'M)', s: 'Exodus 34:1-26; Numbers 28:19-25'},
    {h: 'Pesach VI (CH\'\'M)', s: 'Numbers 9:1-14, 28:19-25'},
    {h: 'Pesach VII', s: 'Exodus 13:17-15:26; Numbers 28:19-25'},
  ];
  t.deepEqual(actual, expected);
});

test('pesach-shabbat-chm-on-3rd-day', (t) => {
  const events0 = HebrewCalendar.calendar({year: 5784, isHebrewYear: true, il: false});
  const events = events0.filter((ev) => ev.basename() === 'Pesach');
  const actual = [];
  for (const ev of events) {
    const reading = getLeyningForHoliday(ev, true);
    actual.push({
      d: ev.getDate().greg().toISOString().substring(0, 10),
      h: ev.getDesc(),
      k: getLeyningKeyForEvent(ev, false),
      s: reading && reading.summary,
    });
  }
  const expected = [
    {d: '2024-04-22', h: 'Erev Pesach', k: undefined, s: undefined},
    {
      d: '2024-04-23',
      h: 'Pesach I',
      k: 'Pesach I',
      s: 'Exodus 12:21-51; Numbers 28:16-25',
    },
    {
      d: '2024-04-24',
      h: 'Pesach II',
      k: 'Pesach II',
      s: 'Leviticus 22:26-23:44; Numbers 28:16-25',
    },
    {
      d: '2024-04-25',
      h: 'Pesach III (CH\'\'M)',
      k: 'Pesach Chol ha-Moed Day 1',
      s: 'Exodus 13:1-16; Numbers 28:19-25',
    },
    {
      d: '2024-04-26',
      h: 'Pesach IV (CH\'\'M)',
      k: 'Pesach Chol ha-Moed Day 2',
      s: 'Exodus 22:24-23:19; Numbers 28:19-25',
    },
    {
      d: '2024-04-27',
      h: 'Pesach V (CH\'\'M)',
      k: 'Pesach Shabbat Chol ha-Moed',
      s: 'Exodus 33:12-34:26; Numbers 28:19-25',
    },
    {
      d: '2024-04-28',
      h: 'Pesach VI (CH\'\'M)',
      k: 'Pesach Chol ha-Moed Day 3',
      s: 'Numbers 9:1-14, 28:19-25',
    },
    {
      d: '2024-04-29',
      h: 'Pesach VII',
      k: 'Pesach VII',
      s: 'Exodus 13:17-15:26; Numbers 28:19-25',
    },
    {
      d: '2024-04-30',
      h: 'Pesach VIII',
      k: 'Pesach VIII',
      s: 'Deuteronomy 15:19-16:17; Numbers 28:19-25',
    },
  ];
  t.deepEqual(actual, expected);
});

// eslint-disable-next-line require-jsdoc
function formatAliyah(aliyot, num) {
  return formatAliyahWithBook(aliyot.fullkriyah[num]);
}

test('getLeyningForHoliday', (t) => {
  const options = {year: 5757, isHebrewYear: true, il: true};
  const events = HebrewCalendar.calendar(options);

  const sukkot1 = events.find((e) => e.getDesc() == 'Sukkot I');
  const sukkot1a = getLeyningForHoliday(sukkot1);
  t.is(sukkot1a.fullkriyah['7'].p, 31);
  t.is(sukkot1a.summary, 'Leviticus 22:26-23:44; Numbers 29:12-16');
  const sukkot2 = events.find((e) => e.getDesc() == 'Sukkot II (CH\'\'M)');
  t.is(getLeyningForHoliday(sukkot2).fullkriyah['4'].p, 41);
  const shminiAtzeret = events.find((e) => e.getDesc() == 'Shmini Atzeret');
  t.is(getLeyningForHoliday(shminiAtzeret).fullkriyah['7'].p, 47);
  const tevet17 = events.find((e) => e.getDesc() == 'Asara B\'Tevet');
  t.is(getLeyningForHoliday(tevet17).fullkriyah['3'].e, '34:10');
  const pesach5 = events.find((e) => e.getDesc() == 'Pesach V (CH\'\'M)');
  t.is(getLeyningForHoliday(pesach5).fullkriyah['4'].p, 21);
  const shavuot = events.find((e) => e.getDesc() == 'Shavuot');
  t.is(getLeyningForHoliday(shavuot).fullkriyah['4'].p, 17);
  const av9 = events.find((e) => e.getDesc() == 'Tish\'a B\'Av');
  t.is(getLeyningForHoliday(av9).haftara, 'Jeremiah 8:13-9:23');
});

test('getLeyningForHoliday-Chanukah', (t) => {
  const options = {year: 5757, isHebrewYear: true, il: true};
  const events = HebrewCalendar.calendar(options);
  const chanukah3 = events.find((e) => e.getDesc() == 'Chanukah: 3 Candles');
  const reading = getLeyningForHoliday(chanukah3);
  const expected = {
    name: {en: 'Chanukah Day 2 (on Shabbat)', he: 'חֲנוּכָּה יוֹם ב׳ (בְּשַׁבָּת)'},
    fullkriyah: {M: {p: 35, k: 'Numbers', b: '7:18', e: '7:23', v: 6}},
    haft: {k: 'Zechariah', b: '2:14', e: '4:7', v: 21},
    haftara: 'Zechariah 2:14-4:7',
    haftaraNumV: 21,
  };
  t.deepEqual(reading, expected);
});

test('getLeyningForHoliday-RoshChodesh', (t) => {
  const ev = new Event(new HDate(1, months.SIVAN, 5782),
      'Rosh Chodesh Sivan', flags.ROSH_CHODESH);
  const expected = {
    name: {
      en: 'Rosh Chodesh Sivan',
      he: 'רֹאשׁ חוֹדֶשׁ סִיוָן',
    },
    summary: 'Numbers 28:1-15',
    fullkriyah: {
      '1': {p: 41, k: 'Numbers', b: '28:1', e: '28:3', v: 3},
      '2': {p: 41, k: 'Numbers', b: '28:3', e: '28:5', v: 3},
      '3': {p: 41, k: 'Numbers', b: '28:6', e: '28:10', v: 5},
      '4': {p: 41, k: 'Numbers', b: '28:11', e: '28:15', v: 5},
    },
  };
  const actual = getLeyningForHoliday(ev);
  t.deepEqual(actual, expected);
});

test('Rosh Chodesh Tevet', (t) => {
  const expectedDay6 = {
    name: {
      en: 'Chanukah Day 6',
      he: 'חֲנוּכָּה יוֹם ו׳',
    },
    fullkriyah: {
      '1': {p: 41, k: 'Numbers', b: '28:1', e: '28:5', v: 5},
      '2': {p: 41, k: 'Numbers', b: '28:6', e: '28:10', v: 5},
      '3': {p: 41, k: 'Numbers', b: '28:11', e: '28:15', v: 5},
      '4': {p: 35, k: 'Numbers', b: '7:42', e: '7:47', v: 6},
    },
    summary: 'Numbers 28:1-15, 7:42-47',
    summaryParts: [
      {k: 'Numbers', b: '28:1', e: '28:15'},
      {k: 'Numbers', b: '7:42', e: '7:47'},
    ],
  };
  const rchTevet = new Event(new HDate(1, months.TEVET, 5784),
      'Rosh Chodesh Tevet', flags.ROSH_CHODESH);
  const reading2 = getLeyningForHoliday(rchTevet);
  t.deepEqual(reading2, expectedDay6);

  const rchTevet30kis = new Event(new HDate(30, months.KISLEV, 5787),
      'Rosh Chodesh Tevet', flags.ROSH_CHODESH);
  const reading3 = getLeyningForHoliday(rchTevet30kis);
  t.deepEqual(reading3, expectedDay6);

  const expectedDay7rch = {
    name: {
      en: 'Chanukah Day 7 (on Rosh Chodesh)',
      he: 'חֲנוּכָּה יוֹם ז׳ (רֹאשׁ חוֹדֶשׁ)',
    },
    fullkriyah: {
      '1': {p: 41, k: 'Numbers', b: '28:1', e: '28:5', v: 5},
      '2': {p: 41, k: 'Numbers', b: '28:6', e: '28:10', v: 5},
      '3': {p: 41, k: 'Numbers', b: '28:11', e: '28:15', v: 5},
      '4': {p: 35, k: 'Numbers', b: '7:48', e: '7:53', v: 6},
    },
    summary: 'Numbers 28:1-15, 7:48-53',
    summaryParts: [
      {k: 'Numbers', b: '28:1', e: '28:15'},
      {k: 'Numbers', b: '7:48', e: '7:53'},
    ],
  };
  const rchTevet1tev = new Event(new HDate(1, months.TEVET, 5787),
      'Rosh Chodesh Tevet', flags.ROSH_CHODESH);
  const reading4 = getLeyningForHoliday(rchTevet1tev);
  t.deepEqual(reading4, expectedDay7rch);
});

test('getLeyningForHoliday-9av-obvs', (t) => {
  const ev = new Event(new HDate(10, months.AV, 5782),
      'Tish\'a B\'Av (observed)', flags.MAJOR_FAST, {observed: true});
  const expected = {
    name: {
      en: 'Tish\'a B\'Av',
      he: 'תִּשְׁעָה בְּאָב',
    },
    summary: 'Deuteronomy 4:25-40',
    fullkriyah: {
      '1': {p: 45, k: 'Deuteronomy', b: '4:25', e: '4:29', v: 5},
      '2': {p: 45, k: 'Deuteronomy', b: '4:30', e: '4:35', v: 6},
      '3': {p: 45, k: 'Deuteronomy', b: '4:36', e: '4:40', v: 5},
    },
    haft: {
      b: '8:13',
      e: '9:23',
      k: 'Jeremiah',
      v: 34,
    },
    haftara: 'Jeremiah 8:13-9:23',
    haftaraNumV: 34,
  };
  const actual = getLeyningForHoliday(ev);
  t.deepEqual(actual, expected);
});

test('shmini-atzeret', (t) => {
  const diaspora = HebrewCalendar.calendar({year: 2019, month: 10, il: false});
  const shminiDiaspora = diaspora.find((e) => e.getDesc() == 'Shmini Atzeret');
  t.is(getLeyningForHoliday(shminiDiaspora, false).haftara, 'I Kings 8:54-66');

  const israel = HebrewCalendar.calendar({year: 2019, month: 10, il: true});
  const shminiIsrael = israel.find((e) => e.getDesc() == 'Shmini Atzeret');
  t.is(getLeyningForHoliday(shminiIsrael, true).haftara, 'Joshua 1:1-18');
});

test('sukkot-shabbat-chm', (t) => {
  const diaspora = HebrewCalendar.calendar({year: 2019, month: 10, il: false});
  const sukkotShabbatD = diaspora.find((e) => e.getDesc() == 'Sukkot VI (CH\'\'M)');
  const a1 = getLeyningForHoliday(sukkotShabbatD);
  t.is(a1.haftara, 'Ezekiel 38:18-39:16');
  t.is(formatAliyah(a1, 'M'), 'Numbers 29:26-29:31');

  const israel = HebrewCalendar.calendar({year: 2017, month: 10, il: true});
  const sukkotShabbatIL = israel.find((e) => e.getDesc() == 'Sukkot III (CH\'\'M)');
  const a2 = getLeyningForHoliday(sukkotShabbatIL);
  t.is(a2.haftara, 'Ezekiel 38:18-39:16');
  t.is(formatAliyah(a2, 'M'), 'Numbers 29:20-29:25');
});

test('no-leyning-on-holiday', (t) => {
  const options = {year: 5757, isHebrewYear: true, il: true};
  const events = HebrewCalendar.calendar(options);
  const tuBiShvat = events.find((e) => e.getDesc() == 'Tu BiShvat');
  const a = getLeyningForHoliday(tuBiShvat);
  t.is(a, undefined);
});

test('ignoreUserEvent-getLeyningForHoliday', (t) => {
  const ev = new Event(new HDate(20, months.TISHREI, 5780), 'Birthday', flags.USER_EVENT);
  const a = getLeyningForHoliday(ev);
  t.is(a, undefined);
});

test('pesach-days-567', (t) => {
  const april20 = new Date(2022, 3, 20);
  const april22 = new Date(2022, 3, 22);
  const events = HebrewCalendar.calendar({start: april20, end: april22});
  const result = events.map((ev) => getLeyningForHoliday(ev, false));
  const expected = [{
    name: {
      en: 'Pesach Chol ha-Moed Day 3',
      he: 'פֶּסַח חוֹל הַמּוֹעֵד יוֹם ג׳',
    },
    summary: 'Exodus 34:1-26; Numbers 28:19-25',
    summaryParts: [
      {k: 'Exodus', b: '34:1', e: '34:26'},
      {k: 'Numbers', b: '28:19', e: '28:25'},
    ],
    fullkriyah: {
      '1': {p: 21, k: 'Exodus', b: '34:1', e: '34:10', v: 10},
      '2': {p: 21, k: 'Exodus', b: '34:11', e: '34:17', v: 7},
      '3': {p: 21, k: 'Exodus', b: '34:18', e: '34:26', v: 9},
      '4': {p: 41, k: 'Numbers', b: '28:19', e: '28:25', v: 7},
    },
  },
  {
    name: {
      en: 'Pesach Chol ha-Moed Day 4',
      he: 'פֶּסַח חוֹל הַמּוֹעֵד יוֹם ד׳',
    },
    summary: 'Numbers 9:1-14, 28:19-25',
    summaryParts: [
      {k: 'Numbers', b: '9:1', e: '9:14'},
      {k: 'Numbers', b: '28:19', e: '28:25'},
    ],
    fullkriyah: {
      '1': {p: 36, k: 'Numbers', b: '9:1', e: '9:5', v: 5},
      '2': {p: 36, k: 'Numbers', b: '9:6', e: '9:8', v: 3},
      '3': {p: 36, k: 'Numbers', b: '9:9', e: '9:14', v: 6},
      '4': {p: 41, k: 'Numbers', b: '28:19', e: '28:25', v: 7},
    },
  },
  {
    name: {
      en: 'Pesach VII',
      he: 'פֶּסַח ז׳',
    },
    summary: 'Exodus 13:17-15:26; Numbers 28:19-25',
    summaryParts: [
      {k: 'Exodus', b: '13:17', e: '15:26'},
      {k: 'Numbers', b: '28:19', e: '28:25'},
    ],
    fullkriyah: {
      '1': {p: 16, k: 'Exodus', b: '13:17', e: '13:22', v: 6},
      '2': {p: 16, k: 'Exodus', b: '14:1', e: '14:8', v: 8},
      '3': {p: 16, k: 'Exodus', b: '14:9', e: '14:14', v: 6},
      '4': {p: 16, k: 'Exodus', b: '14:15', e: '14:25', v: 11},
      '5': {p: 16, k: 'Exodus', b: '14:26', e: '15:26', v: 32},
      'M': {p: 41, k: 'Numbers', b: '28:19', e: '28:25', v: 7},
    },
    haft: {
      b: '22:1',
      e: '22:51',
      k: 'II Samuel',
      v: 51,
    },
    haftara: 'II Samuel 22:1-51',
    haftaraNumV: 51,
  }];
  t.deepEqual(result, expected);
});

test('israel-sukkot-chm-day5', (t) => {
  const october8 = new Date(2020, 9, 8);
  const israel = HebrewCalendar.calendar({
    il: true, start: october8, end: october8,
  });
  t.is(israel[0].getDesc(), 'Sukkot VI (CH\'\'M)');
  const sukkotChmDay5 = getLeyningForHoliday(israel[0], true);
  t.deepEqual(sukkotChmDay5, {
    name: {
      en: 'Sukkot Chol ha-Moed Day 5',
      he: 'סוּכּוֹת חוֹל הַמּוֹעֵד יוֹם ה׳',
    },
    summary: 'Numbers 29:29-37, 29:29-34',
    summaryParts: [
      {k: 'Numbers', b: '29:29', e: '29:37'},
      {k: 'Numbers', b: '29:29', e: '29:34'},
    ],
    fullkriyah: {
      '1': {p: 41, k: 'Numbers', b: '29:29', e: '29:31', v: 3},
      '2': {p: 41, k: 'Numbers', b: '29:32', e: '29:34', v: 3},
      '3': {p: 41, k: 'Numbers', b: '29:35', e: '29:37', v: 3},
      '4': {p: 41, k: 'Numbers', b: '29:29', e: '29:34', v: 6},
    },
  });
});

test('longest-holiday-haftarah', (t) => {
  const events = HebrewCalendar.calendar({
    year: 2023,
    numYears: 19,
    isHebrewYear: false,
    sedrot: false,
  });
  let numverses = 0;
  let holiday = '';
  for (const ev of events) {
    const reading = getLeyningForHoliday(ev);
    if (reading && reading.haftaraNumV > numverses) {
      numverses = reading.haftaraNumV;
      holiday = ev.getDesc();
    }
  }
  t.is(numverses, 51);
  t.is(holiday, 'Pesach VII');
});

test('Sukkot Shabbat Chol ha-Moed', (t) => {
  const hd = new HDate(20, 'Tishrei', 5783);
  const events = HebrewCalendar.calendar({
    start: hd,
    end: hd,
  });
  const reading = getLeyningForHoliday(events[0]);
  const expected = {
    name: {
      en: 'Sukkot Shabbat Chol ha-Moed',
      he: 'סוּכּוֹת שַׁבָּת חוֹל הַמּוֹעֵד',
    },
    fullkriyah: {
      '1': {p: 21, k: 'Exodus', b: '33:12', e: '33:16', v: 5},
      '2': {p: 21, k: 'Exodus', b: '33:17', e: '33:19', v: 3},
      '3': {p: 21, k: 'Exodus', b: '33:20', e: '33:23', v: 4},
      '4': {p: 21, k: 'Exodus', b: '34:1', e: '34:3', v: 3},
      '5': {p: 21, k: 'Exodus', b: '34:4', e: '34:10', v: 7},
      '6': {p: 21, k: 'Exodus', b: '34:11', e: '34:17', v: 7},
      '7': {p: 21, k: 'Exodus', b: '34:18', e: '34:26', v: 9},
      'M': {p: 41, k: 'Numbers', b: '29:26', e: '29:31', v: 6},
    },
    summary: 'Exodus 33:12-34:26; Numbers 29:26-31',
    summaryParts: [
      {k: 'Exodus', b: '33:12', e: '34:26'},
      {k: 'Numbers', b: '29:26', e: '29:31'},
    ],
    haft: {k: 'Ezekiel', b: '38:18', e: '39:16', v: 22},
    haftara: 'Ezekiel 38:18-39:16',
    haftaraNumV: 22,
  };
  t.deepEqual(reading, expected);
});

test('17tamuz', (t) => {
  const hd = new HDate(17, 'Tamuz', 5783);
  const events = HebrewCalendar.calendar({
    start: hd,
    end: hd,
  });
  const reading = getLeyningForHoliday(events[0]);
  const expected = {
    name: {en: 'Tzom Tammuz', he: 'צוֹם תָּמוּז'},
    fullkriyah: {
      '1': {p: 21, k: 'Exodus', b: '32:11', e: '32:14', v: 4},
      '2': {p: 21, k: 'Exodus', b: '34:1', e: '34:3', v: 3},
      '3': {p: 21, k: 'Exodus', b: '34:4', e: '34:10', v: 7},
    },
    summary: 'Exodus 32:11-14, 34:1-10',
    summaryParts: [
      {k: 'Exodus', b: '32:11', e: '32:14'},
      {k: 'Exodus', b: '34:1', e: '34:10'},
    ],
  };
  t.deepEqual(reading, expected);
});

test('9av', (t) => {
  const hd = new HDate(9, 'Av', 5783);
  const events = HebrewCalendar.calendar({
    start: hd,
    end: hd,
  });
  const reading = getLeyningForHoliday(events[0]);
  const expected = {
    name: {en: 'Tish\'a B\'Av', he: 'תִּשְׁעָה בְּאָב'},
    fullkriyah: {
      '1': {p: 45, k: 'Deuteronomy', b: '4:25', e: '4:29', v: 5},
      '2': {p: 45, k: 'Deuteronomy', b: '4:30', e: '4:35', v: 6},
      '3': {p: 45, k: 'Deuteronomy', b: '4:36', e: '4:40', v: 5},
    },
    summary: 'Deuteronomy 4:25-40',
    haft: {k: 'Jeremiah', b: '8:13', e: '9:23', v: 34},
    haftara: 'Jeremiah 8:13-9:23',
    haftaraNumV: 34,
  };
  t.deepEqual(reading, expected);
});

test('fast day mincha', (t) => {
  const reading = getLeyningForHolidayKey('Tish\'a B\'Av (Mincha)');
  const expected = {
    name: {en: 'Tish\'a B\'Av (Mincha)', he: undefined},
    fullkriyah: {
      '1': {p: 21, k: 'Exodus', b: '32:11', e: '32:14', v: 4},
      '2': {p: 21, k: 'Exodus', b: '34:1', e: '34:3', v: 3},
      'M': {p: 21, k: 'Exodus', b: '34:4', e: '34:10', v: 7},
    },
    summary: 'Exodus 32:11-14, 34:1-10',
    summaryParts: [
      {k: 'Exodus', b: '32:11', e: '32:14'},
      {k: 'Exodus', b: '34:1', e: '34:10'},
    ],
    haft: {k: 'Isaiah', b: '55:6', e: '56:8', v: 16},
    haftara: 'Isaiah 55:6-56:8',
    haftaraNumV: 16,
  };
  t.deepEqual(reading, expected);

  const reading2 = getLeyningForHolidayKey('Tzom Gedaliah (Mincha)');
  expected.name = {en: 'Tzom Gedaliah (Mincha)', he: undefined};
  t.deepEqual(reading2, expected);

  const reading3 = getLeyningForHolidayKey('Ta\'anit Bechorot (Mincha)');
  expected.name = {en: 'Ta\'anit Bechorot (Mincha)', he: undefined};
  t.deepEqual(reading3, expected);
});
