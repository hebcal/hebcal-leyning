import test from 'ava';
import {HDate, HebrewCalendar, Event, months, flags} from '@hebcal/core';
import {
  getLeyningForHoliday,
  getLeyningForParshaHaShavua,
  getLeyningKeyForEvent,
  formatAliyahWithBook,
} from './leyning';

test('getLeyningKeyForEvent', (t) => {
  const options = {year: 5757, isHebrewYear: true};
  const events = HebrewCalendar.calendar(options);
  const keys = {};
  for (const ev of events) {
    keys[ev.getDesc()] = getLeyningKeyForEvent(ev);
  }
  const expected = {
    'Erev Rosh Hashana': undefined,
    'Rosh Hashana 5757': 'Rosh Hashana I (on Shabbat)',
    'Rosh Hashana II': 'Rosh Hashana II',
    'Tzom Gedaliah': 'Tzom Gedaliah',
    'Shabbat Shuva': 'Shabbat Shuva',
    'Erev Yom Kippur': undefined,
    'Yom Kippur': 'Yom Kippur',
    'Erev Sukkot': undefined,
    'Sukkot I': 'Sukkot I (on Shabbat)',
    'Sukkot II': 'Sukkot II',
    'Sukkot III (CH\'\'M)': 'Sukkot Chol ha-Moed Day 1',
    'Sukkot IV (CH\'\'M)': 'Sukkot Chol ha-Moed Day 2',
    'Sukkot V (CH\'\'M)': 'Sukkot Chol ha-Moed Day 3',
    'Sukkot VI (CH\'\'M)': 'Sukkot Chol ha-Moed Day 4',
    'Sukkot VII (Hoshana Raba)': 'Sukkot Final Day (Hoshana Raba)',
    'Shmini Atzeret': 'Shmini Atzeret (on Shabbat)',
    'Simchat Torah': 'Simchat Torah',
    'Rosh Chodesh Cheshvan': undefined,
    'Rosh Chodesh Kislev': undefined,
    'Chanukah: 1 Candle': undefined,
    'Chanukah: 2 Candles': 'Chanukah (Day 1)',
    'Chanukah: 3 Candles': 'Chanukah (Day 2)',
    'Chanukah: 4 Candles': 'Chanukah (Day 3)',
    'Chanukah: 5 Candles': 'Chanukah (Day 4)',
    'Chanukah: 6 Candles': 'Chanukah (Day 5)',
    'Chanukah: 7 Candles': 'Chanukah (Day 6)',
    'Rosh Chodesh Tevet': undefined,
    'Chanukah: 8 Candles': 'Chanukah (Day 7)',
    'Chanukah: 8th Day': 'Chanukah (Day 8)',
    'Asara B\'Tevet': 'Asara B\'Tevet',
    'Rosh Chodesh Sh\'vat': undefined,
    'Tu BiShvat': undefined,
    'Rosh Chodesh Adar I': 'Shabbat Rosh Chodesh',
    'Purim Katan': undefined,
    'Shabbat Shekalim': 'Shabbat Shekalim',
    'Rosh Chodesh Adar II': undefined,
    'Ta\'anit Esther': 'Ta\'anit Esther',
    'Shabbat Zachor': 'Shabbat Zachor',
    'Erev Purim': undefined,
    'Purim': 'Purim',
    'Shushan Purim': 'Shushan Purim',
    'Shabbat Parah': 'Shabbat Parah',
    'Shabbat HaChodesh': 'Shabbat HaChodesh',
    'Rosh Chodesh Nisan': undefined,
    'Shabbat HaGadol': 'Shabbat HaGadol',
    'Ta\'anit Bechorot': 'Ta\'anit Bechorot',
    'Erev Pesach': undefined,
    'Pesach I': 'Pesach I',
    'Pesach II': 'Pesach II',
    'Pesach III (CH\'\'M)': 'Pesach Chol ha-Moed Day 1',
    'Pesach IV (CH\'\'M)': 'Pesach Chol ha-Moed Day 2',
    'Pesach V (CH\'\'M)': 'Pesach Shabbat Chol ha-Moed',
    'Pesach VI (CH\'\'M)': 'Pesach Chol ha-Moed Day 3',
    'Pesach VII': 'Pesach VII',
    'Pesach VIII': 'Pesach VIII',
    'Yom HaShoah': undefined,
    'Rosh Chodesh Iyyar': undefined,
    'Yom HaZikaron': undefined,
    'Yom HaAtzma\'ut': undefined,
    'Pesach Sheni': undefined,
    'Lag BaOmer': undefined,
    'Yom Yerushalayim': undefined,
    'Rosh Chodesh Sivan': undefined,
    'Erev Shavuot': undefined,
    'Shavuot I': 'Shavuot I',
    'Shavuot II': 'Shavuot II',
    'Rosh Chodesh Tamuz': undefined,
    'Tzom Tammuz': 'Tzom Tammuz',
    'Rosh Chodesh Av': undefined,
    'Shabbat Chazon': undefined,
    'Erev Tish\'a B\'Av': undefined,
    'Tish\'a B\'Av': 'Tish\'a B\'Av',
    'Shabbat Nachamu': 'Shabbat Nachamu',
    'Tu B\'Av': undefined,
    'Rosh Chodesh Elul': undefined,
    'Leil Selichot': undefined,
  };
  t.deepEqual(keys, expected);
});

/*
7/18/1981 16th of Tamuz, 5741
7/18/1981 Parashat Pinchas
--
7/10/1982 19th of Tamuz, 5742
7/10/1982 Parashat Pinchas
*/
test('pinchas17Tamuz', (t) => {
  const options = {year: 1981, month: 7, isHebrewYear: false, sedrot: true, noHolidays: true};
  let events = HebrewCalendar.calendar(options);
  let ev = events.find((e) => e.getDesc() == 'Parashat Pinchas');
  let a = getLeyningForParshaHaShavua(ev);
  t.is(a.reason, undefined);
  t.is(a.haftara, 'I Kings 18:46 - 19:21');

  options.year = 1982;
  events = HebrewCalendar.calendar(options);
  ev = events.find((e) => e.getDesc() == 'Parashat Pinchas');
  a = getLeyningForParshaHaShavua(ev);
  t.is(a.haftara, 'Jeremiah 1:1 - 2:3');
  t.is(a.reason.haftara, 'Pinchas occurring after 17 Tammuz');
});

// eslint-disable-next-line require-jsdoc
function formatAliyah(aliyot, num) {
  return formatAliyahWithBook(aliyot.fullkriyah[num]);
}

test('getLeyningForParshaHaShavua', (t) => {
  const options = {year: 2026, isHebrewYear: false, sedrot: true, noHolidays: true};
  const events = HebrewCalendar.calendar(options);
  for (const ev of events) {
    const a = getLeyningForParshaHaShavua(ev);
    switch (ev.getDesc()) {
      case 'Parashat Mishpatim':
        t.is(a.reason.haftara, 'Shabbat Shekalim');
        t.is(a.reason.M, 'Shabbat Shekalim');
        t.is(a.haftara, 'II Kings 12:1 - 12:17');
        t.is(formatAliyah(a, 'M'), 'Exodus 30:11 - 30:16');
        break;
      case 'Parashat Tetzaveh':
        t.is(a.reason.haftara, 'Shabbat Zachor');
        t.is(a.reason.M, 'Shabbat Zachor');
        t.is(a.haftara, 'I Samuel 15:2 - 15:34');
        t.is(formatAliyah(a, 'M'), 'Deuteronomy 25:17 - 25:19');
        break;
      case 'Parashat Ki Tisa':
        t.is(a.reason.haftara, 'Shabbat Parah');
        t.is(a.reason.M, 'Shabbat Parah');
        t.is(a.haftara, 'Ezekiel 36:16 - 36:38');
        t.is(formatAliyah(a, 'M'), 'Numbers 19:1 - 19:22');
        break;
      case 'Parashat Tzav':
        t.is(a.reason.haftara, 'Shabbat HaGadol');
        t.is(a.haftara, 'Malachi 3:4 - 3:24');
        break;
      case 'Parashat Tazria-Metzora':
        t.is(a.reason.haftara, 'Shabbat Rosh Chodesh');
        t.is(a.reason.M, 'Shabbat Rosh Chodesh');
        t.is(a.haftara, 'Isaiah 66:1 - 66:24');
        t.is(formatAliyah(a, 'M'), 'Numbers 28:9 - 28:15');
        break;
      case 'Parashat Bamidbar':
        t.is(a.reason.haftara, 'Shabbat Machar Chodesh');
        t.is(a.haftara, 'I Samuel 20:18 - 20:42');
        break;
      case 'Parashat Vayeshev':
        t.is(a.reason.haftara, 'Shabbat Chanukah');
        t.is(a.reason.M, 'Chanukah (Day 1)');
        t.is(a.haftara, 'Zechariah 2:14-4:7');
        t.is(formatAliyah(a, 'M'), 'Numbers 7:1 - 7:17');
        break;
      case 'Parashat Miketz':
        const expected = {
          summary: 'Genesis 41:1-44:17',
          fullkriyah: {
            '1': {k: 'Genesis', b: '41:1', e: '41:14', v: 14},
            '2': {k: 'Genesis', b: '41:15', e: '41:38', v: 24},
            '3': {k: 'Genesis', b: '41:39', e: '41:52', v: 14},
            '4': {k: 'Genesis', b: '41:53', e: '42:18', v: 23},
            '5': {k: 'Genesis', b: '42:19', e: '43:15', v: 35},
            '6': {k: 'Genesis', b: '43:16', e: '43:29', v: 14},
            '7': {k: 'Genesis', b: '43:30', e: '44:17', v: 22},
            'M': {p: 35, k: 'Numbers', b: '7:54', e: '8:4'},
          },
          haftara: 'I Kings 7:40-50',
          reason: {
            haftara: 'Shabbat Chanukah II',
            M: 'Chanukah (Day 8)',
          },
        };
        t.deepEqual(a, expected, 'Shabbat Chanukah II');
        break;
    }
  }

  options.year = 2020;
  options.month = 12;
  let events2 = HebrewCalendar.calendar(options);
  const vayeshev = events2.find((e) => e.getDesc() == 'Parashat Vayeshev');
  let a = getLeyningForParshaHaShavua(vayeshev);
  t.is(a.reason.haftara, 'Shabbat Chanukah');
  t.is(a.reason['M'], 'Chanukah (Day 2)');
  t.is(a.haftara, 'Zechariah 2:14-4:7');
  t.is(formatAliyah(a, 'M'), 'Numbers 7:18 - 7:29');

  options.year = 2021;
  options.month = 12;
  events2 = HebrewCalendar.calendar(options);
  const miketz = events2.find((e) => e.getDesc() == 'Parashat Miketz');
  const expected = {
    summary: 'Genesis 41:1-44:17',
    fullkriyah: {
      '1': {k: 'Genesis', b: '41:1', e: '41:14', v: 14},
      '2': {k: 'Genesis', b: '41:15', e: '41:38', v: 24},
      '3': {k: 'Genesis', b: '41:39', e: '41:52', v: 14},
      '4': {k: 'Genesis', b: '41:53', e: '42:18', v: 23},
      '5': {k: 'Genesis', b: '42:19', e: '43:15', v: 35},
      '6': {k: 'Genesis', b: '43:16', e: '44:17', v: 36},
      '7': {p: 41, k: 'Numbers', b: '28:9', e: '28:15'},
      'M': {p: 35, k: 'Numbers', b: '7:42', e: '7:47'},
    },
    haftara: 'Zechariah 2:14-4:7',
    reason: {
      '7': 'Shabbat Rosh Chodesh Chanukah',
      'haftara': 'Shabbat Rosh Chodesh Chanukah',
      'M': 'Shabbat Rosh Chodesh Chanukah',
    },
  };
  a = getLeyningForParshaHaShavua(miketz);
  t.deepEqual(a, expected, 'Shabbat Rosh Chodesh Chanukah');

  options.year = 2019;
  options.month = 4;
  events2 = HebrewCalendar.calendar(options);
  const tazria = events2.find((e) => e.getDesc() == 'Parashat Tazria');
  a = getLeyningForParshaHaShavua(tazria);
  t.is(a.reason.haftara, 'Shabbat HaChodesh (on Rosh Chodesh)');
  t.is(a.reason['7'], 'Shabbat HaChodesh (on Rosh Chodesh)');
  t.is(a.reason['M'], 'Shabbat HaChodesh (on Rosh Chodesh)');
  t.is(a.haftara, 'Ezekiel 45:16 - 46:18');
  t.is(formatAliyah(a, '7'), 'Numbers 28:9 - 28:15');
  t.is(formatAliyah(a, 'M'), 'Exodus 12:1 - 12:20');
});

test('getLeyningForHoliday', (t) => {
  const options = {year: 5757, isHebrewYear: true, il: true};
  const events = HebrewCalendar.calendar(options);

  const sukkot1 = events.find((e) => e.getDesc() == 'Sukkot I');
  const sukkot1a = getLeyningForHoliday(sukkot1);
  t.is(sukkot1a.fullkriyah['7'].p, 31);
  t.is(sukkot1a.summary, 'Leviticus 22:26-23:44');
  const sukkot2 = events.find((e) => e.getDesc() == 'Sukkot II (CH\'\'M)');
  t.is(getLeyningForHoliday(sukkot2).fullkriyah['4'].p, 41);
  const shminiAtzeret = events.find((e) => e.getDesc() == 'Shmini Atzeret');
  t.is(getLeyningForHoliday(shminiAtzeret).fullkriyah['7'].p, 47);
  const chanukah3 = events.find((e) => e.getDesc() == 'Chanukah: 3 Candles');
  t.is(getLeyningForHoliday(chanukah3).fullkriyah['3'].e, '7:29');
  const tevet17 = events.find((e) => e.getDesc() == 'Asara B\'Tevet');
  t.is(getLeyningForHoliday(tevet17).fullkriyah['3'].e, '34:10');
  const pesach5 = events.find((e) => e.getDesc() == 'Pesach V (CH\'\'M)');
  t.is(getLeyningForHoliday(pesach5).fullkriyah['4'].p, 21);
  const shavuot = events.find((e) => e.getDesc() == 'Shavuot');
  t.is(getLeyningForHoliday(shavuot).fullkriyah['4'].p, 17);
  const av9 = events.find((e) => e.getDesc() == 'Tish\'a B\'Av');
  t.is(getLeyningForHoliday(av9).haftara, 'Jeremiah 8:13 - 9:23');
  const nachamu = events.find((e) => e.getDesc() == 'Shabbat Nachamu');
  t.is(getLeyningForHoliday(nachamu).haftara, 'Isaiah 40:1 - 40:26');
  t.is(getLeyningForHoliday(nachamu).fullkriyah, undefined);
  t.is(getLeyningForHoliday(nachamu).summary, undefined);
});

test('shmini-atzeret', (t) => {
  const diaspora = HebrewCalendar.calendar({year: 2019, month: 10, il: false});
  const shminiDiaspora = diaspora.find((e) => e.getDesc() == 'Shmini Atzeret');
  t.is(getLeyningForHoliday(shminiDiaspora, false).haftara, 'I Kings 8:54 - 8:66');

  const israel = HebrewCalendar.calendar({year: 2019, month: 10, il: true});
  const shminiIsrael = israel.find((e) => e.getDesc() == 'Shmini Atzeret');
  t.is(getLeyningForHoliday(shminiIsrael, true).haftara, 'Joshua 1:1 - 1:18');
});

test('sukkot-shabbat-chm', (t) => {
  const diaspora = HebrewCalendar.calendar({year: 2019, month: 10, il: false});
  const sukkotShabbatD = diaspora.find((e) => e.getDesc() == 'Sukkot VI (CH\'\'M)');
  const a1 = getLeyningForHoliday(sukkotShabbatD);
  t.is(a1.haftara, 'Ezekiel 38:18 - 39:16');
  t.is(formatAliyah(a1, 'M'), 'Numbers 29:26 - 29:31');

  const israel = HebrewCalendar.calendar({year: 2017, month: 10, il: true});
  const sukkotShabbatIL = israel.find((e) => e.getDesc() == 'Sukkot III (CH\'\'M)');
  const a2 = getLeyningForHoliday(sukkotShabbatIL);
  t.is(a2.haftara, 'Ezekiel 38:18 - 39:16');
  t.is(formatAliyah(a2, 'M'), 'Numbers 29:20 - 29:25');
});

test('sephardic', (t) => {
  const options = {year: 2021, isHebrewYear: false, sedrot: true, noHolidays: true};
  const events = HebrewCalendar.calendar(options);
  const bereshit = events.find((ev) => ev.getDesc() == 'Parashat Bereshit');
  const a = getLeyningForParshaHaShavua(bereshit);
  t.is(a.haftara, 'Isaiah 42:5 - 43:10');
  t.is(a.sephardic, 'Isaiah 42:5 - 42:21');
});

test('no-leyning-on-holiday', (t) => {
  const options = {year: 5757, isHebrewYear: true, il: true};
  const events = HebrewCalendar.calendar(options);
  const tuBiShvat = events.find((e) => e.getDesc() == 'Tu BiShvat');
  const a = getLeyningForHoliday(tuBiShvat);
  t.is(a, undefined);
});

test('israel-getLeyningForParshaHaShavua', (t) => {
  const june6 = new Date(2020, 5, 6);
  const diaspora = HebrewCalendar.calendar({
    il: false, sedrot: true, noHolidays: true, start: june6, end: june6,
  });
  t.is(diaspora[0].getDesc(), 'Parashat Nasso');
  const nassoDiaspora = getLeyningForParshaHaShavua(diaspora[0], false);
  const may30 = new Date(2020, 4, 30);
  const israel = HebrewCalendar.calendar({
    il: true, sedrot: true, noHolidays: true, start: may30, end: may30,
  });
  t.is(israel[0].getDesc(), 'Parashat Nasso');
  const nassoIL = getLeyningForParshaHaShavua(israel[0], true);
  t.deepEqual(nassoDiaspora, nassoIL);
});

test('ignoreUserEvent-getLeyningForHoliday', (t) => {
  const ev = new Event(new HDate(20, months.TISHREI, 5780), 'Birthday', flags.USER_EVENT);
  const a = getLeyningForHoliday(ev);
  t.is(a, undefined);
});
