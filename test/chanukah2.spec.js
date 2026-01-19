import {expect, test} from 'vitest';
import {HebrewCalendar, flags} from '@hebcal/core';
import {getLeyningForHoliday} from '../src/getLeyningForHoliday';
import {getLeyningForParshaHaShavua} from '../src/leyning';

test('Chanukah', () => {
  const events = HebrewCalendar.calendar({
    start: new Date(2022, 11, 17),
    end: new Date(2022, 11, 27),
    sedrot: true,
    il: true,
  });
  const actual = [];
  let i = 0;
  for (const ev of events) {
    const mask = ev.getFlags();
    const reading = (mask & flags.PARSHA_HASHAVUA) ?
      getLeyningForParshaHaShavua(ev, true) :
      getLeyningForHoliday(ev, true);
    const readingHe = (mask & flags.PARSHA_HASHAVUA) ?
      getLeyningForParshaHaShavua(ev, true, 'he') :
      getLeyningForHoliday(ev, true, 'he');
    actual.push({
      i: i++,
      dt: ev.greg().toLocaleDateString('en-CA').substring(0, 10),
      d: ev.getDesc(),
      n: reading?.name.en,
      s: reading?.summary,
      nHe: readingHe?.name.he,
      sHe: readingHe?.summary,
    });
  }
  const expected = [{
    i: 0,
    dt: '2022-12-17',
    d: 'Parashat Vayeshev',
    n: 'Vayeshev',
    s: 'Genesis 37:1-40:23',
    nHe: 'וַיֵּשֶׁב',
    sHe: 'בְּרֵאשִׁית לז:א-מ:כג',
  },
  {
    i: 1,
    dt: '2022-12-18',
    d: 'Chanukah: 1 Candle',
    n: undefined,
    s: undefined,
    nHe: undefined,
    sHe: undefined,
  },
  {
    i: 2,
    dt: '2022-12-19',
    d: 'Chanukah: 2 Candles',
    n: 'Chanukah Day 1',
    s: 'Numbers 7:1-17',
    nHe: 'חֲנוּכָּה יוֹם א׳',
    sHe: 'בְּמִדְבַּר ז:א-יז',
  },
  {
    i: 3,
    dt: '2022-12-20',
    d: 'Chanukah: 3 Candles',
    n: 'Chanukah Day 2',
    s: 'Numbers 7:18-29',
    nHe: 'חֲנוּכָּה יוֹם ב׳',
    sHe: 'בְּמִדְבַּר ז:יח-כט',
  },
  {
    i: 4,
    dt: '2022-12-21',
    d: 'Chanukah: 4 Candles',
    n: 'Chanukah Day 3',
    s: 'Numbers 7:24-35',
    nHe: 'חֲנוּכָּה יוֹם ג׳',
    sHe: 'בְּמִדְבַּר ז:כד-לה',
  },
  {
    i: 5,
    dt: '2022-12-22',
    d: 'Chanukah: 5 Candles',
    n: 'Chanukah Day 4',
    s: 'Numbers 7:30-41',
    nHe: 'חֲנוּכָּה יוֹם ד׳',
    sHe: 'בְּמִדְבַּר ז:ל-מא',
  },
  {
    i: 6,
    dt: '2022-12-23',
    d: 'Chanukah: 6 Candles',
    n: 'Chanukah Day 5',
    s: 'Numbers 7:36-47',
    nHe: 'חֲנוּכָּה יוֹם ה׳',
    sHe: 'בְּמִדְבַּר ז:לו-מז',
  },
  {
    i: 7,
    dt: '2022-12-24',
    d: 'Chag HaBanot',
    n: undefined,
    s: undefined,
    nHe: undefined,
    sHe: undefined,
  },
  {
    i: 8,
    dt: '2022-12-24',
    d: 'Chanukah: 7 Candles',
    n: 'Shabbat Rosh Chodesh Chanukah',
    s: undefined,
    nHe: 'שַׁבָּת רֹאשׁ חוֹדֶשׁ חֲנוּכָּה',
    sHe: undefined,
  },
  {
    i: 9,
    dt: '2022-12-24',
    d: 'Rosh Chodesh Tevet',
    n: 'Shabbat Rosh Chodesh Chanukah',
    s: undefined,
    nHe: 'שַׁבָּת רֹאשׁ חוֹדֶשׁ חֲנוּכָּה',
    sHe: undefined,
  },
  {
    i: 10,
    dt: '2022-12-24',
    d: 'Parashat Miketz',
    n: 'Miketz',
    s: 'Genesis 41:1-44:17; Numbers 28:9-15, 7:42-47',
    nHe: 'מִקֵּץ',
    sHe: 'בְּרֵאשִׁית מא:א-מד:יז; בְּמִדְבַּר כח:ט-טו, ז:מב-מז',
  },
  {
    i: 11,
    dt: '2022-12-25',
    d: 'Chanukah: 8 Candles',
    n: 'Chanukah Day 7 (on Rosh Chodesh)',
    s: 'Numbers 28:1-15, 7:48-53',
    nHe: 'חֲנוּכָּה יוֹם ז׳ (רֹאשׁ חוֹדֶשׁ)',
    sHe: 'בְּמִדְבַּר כח:א-טו, ז:מח-נג',
  },
  {
    i: 12,
    dt: '2022-12-25',
    d: 'Rosh Chodesh Tevet',
    n: 'Chanukah Day 7 (on Rosh Chodesh)',
    s: 'Numbers 28:1-15, 7:48-53',
    nHe: 'חֲנוּכָּה יוֹם ז׳ (רֹאשׁ חוֹדֶשׁ)',
    sHe: 'בְּמִדְבַּר כח:א-טו, ז:מח-נג',
  },
  {
    i: 13,
    dt: '2022-12-26',
    d: 'Chanukah: 8th Day',
    n: 'Chanukah Day 8',
    s: 'Numbers 7:54-8:4',
    nHe: 'חֲנוּכָּה יוֹם ח׳',
    sHe: 'בְּמִדְבַּר ז:נד-ח:ד',
  }];
  expect(actual).toEqual(expected);
});
