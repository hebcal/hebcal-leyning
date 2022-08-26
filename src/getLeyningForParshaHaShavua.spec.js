import test from 'ava';
import {HDate, HebrewCalendar, ParshaEvent} from '@hebcal/core';
import {getLeyningForParshaHaShavua} from './leyning';
import {formatAliyahWithBook} from './common';

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
  t.is(a.haftara, 'I Kings 18:46-19:21');

  options.year = 1982;
  events = HebrewCalendar.calendar(options);
  ev = events.find((e) => e.getDesc() == 'Parashat Pinchas');
  a = getLeyningForParshaHaShavua(ev);
  t.is(a.haftara, 'Jeremiah 1:1-2:3');
  t.is(a.reason.haftara, 'Pinchas occurring after 17 Tammuz');

  options.year = 2022;
  options.il = true;
  events = HebrewCalendar.calendar(options);
  ev = events.find((e) => e.getDesc() == 'Parashat Pinchas');
  a = getLeyningForParshaHaShavua(ev);
  t.is(a.reason, undefined);
  t.is(a.haftara, 'I Kings 18:46-19:21');

  options.year = 2023;
  options.il = true;
  events = HebrewCalendar.calendar(options);
  ev = events.find((e) => e.getDesc() == 'Parashat Pinchas');
  a = getLeyningForParshaHaShavua(ev);
  t.is(a.haftara, 'Jeremiah 1:1-2:3');
  t.is(a.reason.haftara, 'Pinchas occurring after 17 Tammuz');
});

// eslint-disable-next-line require-jsdoc
function formatAliyah(aliyot, num) {
  return formatAliyahWithBook(aliyot.fullkriyah[num]);
}

test('2026', (t) => {
  const options = {year: 2026, isHebrewYear: false, sedrot: true, noHolidays: true};
  const events = HebrewCalendar.calendar(options);
  for (const ev of events) {
    const a = getLeyningForParshaHaShavua(ev);
    switch (ev.getDesc()) {
      case 'Parashat Mishpatim':
        t.is(a.reason.haftara, 'Shabbat Shekalim');
        t.is(a.reason.M, 'Shabbat Shekalim');
        t.is(a.haftara, 'II Kings 12:1-17');
        t.is(formatAliyah(a, 'M'), 'Exodus 30:11-30:16');
        break;
      case 'Parashat Tetzaveh':
        t.is(a.reason.haftara, 'Shabbat Zachor');
        t.is(a.reason.M, 'Shabbat Zachor');
        t.is(a.haftara, 'I Samuel 15:2-34');
        t.is(formatAliyah(a, 'M'), 'Deuteronomy 25:17-25:19');
        break;
      case 'Parashat Ki Tisa':
        t.is(a.reason.haftara, 'Shabbat Parah');
        t.is(a.reason.M, 'Shabbat Parah');
        t.is(a.haftara, 'Ezekiel 36:16-38');
        t.is(formatAliyah(a, 'M'), 'Numbers 19:1-19:22');
        break;
      case 'Parashat Tzav':
        t.is(a.reason.haftara, 'Shabbat HaGadol');
        t.is(a.haftara, 'Malachi 3:4-24');
        break;
      case 'Parashat Tazria-Metzora':
        t.is(a.reason.haftara, 'Shabbat Rosh Chodesh');
        t.is(a.reason.M, 'Shabbat Rosh Chodesh');
        t.is(a.haftara, 'Isaiah 66:1-24');
        t.is(formatAliyah(a, 'M'), 'Numbers 28:9-28:15');
        break;
      case 'Parashat Bamidbar':
        t.is(a.reason.haftara, 'Shabbat Machar Chodesh');
        t.is(a.haftara, 'I Samuel 20:18-42');
        break;
      case 'Parashat Vayeshev':
        t.is(a.reason.haftara, 'Chanukah Day 1 (on Shabbat)');
        t.is(a.haftara, 'Zechariah 2:14-4:7');
        t.is(formatAliyah(a, 'M'), 'Numbers 7:1-7:17');
        break;
      case 'Parashat Miketz':
        const expected = {
          name: {
            en: 'Miketz',
            he: 'מִקֵּץ',
          },
          parsha: [
            'Miketz',
          ],
          parshaNum: 10,
          summary: 'Genesis 41:1-44:17; Numbers 7:54-8:4',
          summaryParts: [
            {k: 'Genesis', b: '41:1', e: '44:17'},
            {k: 'Numbers', b: '7:54', e: '8:4'},
          ],
          fullkriyah: {
            '1': {k: 'Genesis', b: '41:1', e: '41:14', v: 14},
            '2': {k: 'Genesis', b: '41:15', e: '41:38', v: 24},
            '3': {k: 'Genesis', b: '41:39', e: '41:52', v: 14},
            '4': {k: 'Genesis', b: '41:53', e: '42:18', v: 23},
            '5': {k: 'Genesis', b: '42:19', e: '43:15', v: 35},
            '6': {k: 'Genesis', b: '43:16', e: '43:29', v: 14},
            '7': {k: 'Genesis', b: '43:30', e: '44:17', v: 22},
            'M': {p: 35, k: 'Numbers', b: '7:54', e: '8:4', v: 40,
              reason: 'Chanukah Day 8 (on Shabbat)'},
          },
          haft: {
            k: 'I Kings',
            b: '7:40',
            e: '7:50',
            v: 11,
            reason: 'Chanukah Day 8 (on Shabbat)',
          },
          haftara: 'I Kings 7:40-50',
          haftaraNumV: 11,
          weekday: {
            '1': {k: 'Genesis', b: '41:1', e: '41:4', v: 4},
            '2': {k: 'Genesis', b: '41:5', e: '41:7', v: 3},
            '3': {k: 'Genesis', b: '41:8', e: '41:14', v: 7},
          },
          reason: {
            haftara: 'Chanukah Day 8 (on Shabbat)',
            M: 'Chanukah Day 8 (on Shabbat)',
          },
        };
        t.deepEqual(a, expected, 'Chanukah Day 8 (on Shabbat)');
        break;
    }
  }
});

test('2020-12', (t) => {
  const events = HebrewCalendar.calendar({year: 2020, month: 12, sedrot: true, noHolidays: true});
  const vayeshev = events.find((e) => e.getDesc() == 'Parashat Vayeshev');
  const a = getLeyningForParshaHaShavua(vayeshev);
  t.is(a.reason.haftara, 'Chanukah Day 2 (on Shabbat)');
  t.is(a.reason['M'], 'Chanukah Day 2 (on Shabbat)');
  t.is(a.haftara, 'Zechariah 2:14-4:7');
  const expected = {
    p: 35,
    k: 'Numbers',
    b: '7:18',
    e: '7:23',
    v: 6,
    reason: 'Chanukah Day 2 (on Shabbat)',
  };
  t.deepEqual(a.fullkriyah.M, expected);
});

test('2021-12', (t) => {
  const events = HebrewCalendar.calendar({year: 2021, month: 12, sedrot: true, noHolidays: true});
  const miketz = events.find((e) => e.getDesc() == 'Parashat Miketz');
  const expected = {
    name: {
      en: 'Miketz',
      he: 'מִקֵּץ',
    },
    parsha: [
      'Miketz',
    ],
    parshaNum: 10,
    summary: 'Genesis 41:1-44:17; Numbers 28:9-15, 7:42-47',
    fullkriyah: {
      '1': {k: 'Genesis', b: '41:1', e: '41:14', v: 14},
      '2': {k: 'Genesis', b: '41:15', e: '41:38', v: 24},
      '3': {k: 'Genesis', b: '41:39', e: '41:52', v: 14},
      '4': {k: 'Genesis', b: '41:53', e: '42:18', v: 23},
      '5': {k: 'Genesis', b: '42:19', e: '43:15', v: 35},
      '6': {k: 'Genesis', b: '43:16', e: '44:17', v: 36},
      '7': {p: 41, k: 'Numbers', b: '28:9', e: '28:15', v: 7,
        reason: 'Shabbat Rosh Chodesh Chanukah'},
      'M': {p: 35, k: 'Numbers', b: '7:42', e: '7:47', v: 6,
        reason: 'Shabbat Rosh Chodesh Chanukah'},
    },
    summaryParts: [
      {k: 'Genesis', b: '41:1', e: '44:17'},
      {k: 'Numbers', b: '28:9', e: '28:15'},
      {k: 'Numbers', b: '7:42', e: '7:47'},
    ],
    haft: {
      k: 'Zechariah',
      b: '2:14',
      e: '4:7',
      v: 21,
      reason: 'Shabbat Rosh Chodesh Chanukah',
    },
    haftara: 'Zechariah 2:14-4:7',
    haftaraNumV: 21,
    weekday: {
      '1': {k: 'Genesis', b: '41:1', e: '41:4', v: 4},
      '2': {k: 'Genesis', b: '41:5', e: '41:7', v: 3},
      '3': {k: 'Genesis', b: '41:8', e: '41:14', v: 7},
    },
    reason: {
      '7': 'Shabbat Rosh Chodesh Chanukah',
      'haftara': 'Shabbat Rosh Chodesh Chanukah',
      'M': 'Shabbat Rosh Chodesh Chanukah',
    },
  };
  const a = getLeyningForParshaHaShavua(miketz);
  t.deepEqual(a, expected, 'Shabbat Rosh Chodesh Chanukah');
});

test('2019-04', (t) => {
  const events = HebrewCalendar.calendar({year: 2019, month: 4, sedrot: true, noHolidays: true});
  const tazria = events.find((e) => e.getDesc() == 'Parashat Tazria');
  const a = getLeyningForParshaHaShavua(tazria);
  t.is(a.reason.haftara, 'Shabbat HaChodesh (on Rosh Chodesh)');
  t.is(a.reason['7'], 'Shabbat HaChodesh (on Rosh Chodesh)');
  t.is(a.reason['M'], 'Shabbat HaChodesh (on Rosh Chodesh)');
  t.is(a.haftara, 'Ezekiel 45:16-46:18');
  t.is(formatAliyah(a, '7'), 'Numbers 28:9-28:15');
  t.is(formatAliyah(a, 'M'), 'Exodus 12:1-12:20');
});

test('sephardic', (t) => {
  const options = {year: 2021, isHebrewYear: false, sedrot: true, noHolidays: true};
  const events = HebrewCalendar.calendar(options);
  const bereshit = events.find((ev) => ev.getDesc() == 'Parashat Bereshit');
  const a = getLeyningForParshaHaShavua(bereshit);
  t.is(a.haftara, 'Isaiah 42:5-43:10');
  t.is(a.sephardic, 'Isaiah 42:5-21');
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

test('longest-regular-haftarah', (t) => {
  const events = HebrewCalendar.calendar({
    year: 2023, numYears: 19, isHebrewYear: false,
    sedrot: true, noHolidays: true,
  });
  let numverses = 0;
  let parsha = '';
  for (const ev of events) {
    const reading = getLeyningForParshaHaShavua(ev);
    if (reading.haftaraNumV > numverses) {
      numverses = reading.haftaraNumV;
      parsha = ev.getDesc();
    }
  }
  t.is(numverses, 52);
  t.is(parsha, 'Parashat Beshalach');
});

test('masei-rosh-chodesh', (t) => {
  const ev1 = new ParshaEvent(new HDate(1, 'Av', 5781), ['Matot', 'Masei'], false);
  const obj1 = getLeyningForParshaHaShavua(ev1);
  t.is(obj1.haftara, 'Jeremiah 2:4-28, 3:4; Isaiah 66:1, 66:23');
  t.is(obj1.reason.haftara, 'Matot-Masei on Shabbat Rosh Chodesh');

  const ev2 = new ParshaEvent(new HDate(2, 'Av', 5782), ['Matot', 'Masei'], false);
  const obj2 = getLeyningForParshaHaShavua(ev2);
  t.is(obj2.haftara, 'Jeremiah 2:4-28, 3:4');
  t.is(obj2.reason, undefined);

  const ev3 = new ParshaEvent(new HDate(1, 'Av', 5812), ['Masei'], false);
  const obj3 = getLeyningForParshaHaShavua(ev3);
  t.is(obj3.haftara, 'Jeremiah 2:4-28, 3:4; Isaiah 66:1, 66:23');
  t.is(obj3.haftaraNumV, 28);
  t.is(obj3.reason.haftara, 'Masei on Shabbat Rosh Chodesh');

  const ev4 = new ParshaEvent(new HDate(28, 'Tamuz', 5822), ['Masei'], false);
  const obj4 = getLeyningForParshaHaShavua(ev4);
  t.is(obj4.haftara, 'Jeremiah 2:4-28, 3:4');
  t.is(obj4.haftaraNumV, 26);
  t.is(obj4.reason, undefined);
});

