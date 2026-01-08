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
    actual.push({
      i: i++,
      dt: ev.getDate().greg().toLocaleDateString('en-CA').substring(0, 10),
      d: ev.getDesc(),
      n: reading?.name.en,
      s: reading?.summary,
    });
  }
  const expected = [{
    i: 0,
    dt: '2022-12-17',
    d: 'Parashat Vayeshev',
    n: 'Vayeshev',
    s: 'Genesis 37:1-40:23',
  },
  {
    i: 1,
    dt: '2022-12-18',
    d: 'Chanukah: 1 Candle',
    n: undefined,
    s: undefined,
  },
  {
    i: 2,
    dt: '2022-12-19',
    d: 'Chanukah: 2 Candles',
    n: 'Chanukah Day 1',
    s: 'Numbers 7:1-17',
  },
  {
    i: 3,
    dt: '2022-12-20',
    d: 'Chanukah: 3 Candles',
    n: 'Chanukah Day 2',
    s: 'Numbers 7:18-29',
  },
  {
    i: 4,
    dt: '2022-12-21',
    d: 'Chanukah: 4 Candles',
    n: 'Chanukah Day 3',
    s: 'Numbers 7:24-35',
  },
  {
    i: 5,
    dt: '2022-12-22',
    d: 'Chanukah: 5 Candles',
    n: 'Chanukah Day 4',
    s: 'Numbers 7:30-41',
  },
  {
    i: 6,
    dt: '2022-12-23',
    d: 'Chanukah: 6 Candles',
    n: 'Chanukah Day 5',
    s: 'Numbers 7:36-47',
  },
  {
    i: 7,
    dt: '2022-12-24',
    d: 'Chag HaBanot',
    n: undefined,
    s: undefined,
  },
  {
    i: 8,
    dt: '2022-12-24',
    d: 'Chanukah: 7 Candles',
    n: 'Shabbat Rosh Chodesh Chanukah',
    s: undefined,
  },
  {
    i: 9,
    dt: '2022-12-24',
    d: 'Rosh Chodesh Tevet',
    n: 'Shabbat Rosh Chodesh Chanukah',
    s: undefined,
  },
  {
    i: 10,
    dt: '2022-12-24',
    d: 'Parashat Miketz',
    n: 'Miketz',
    s: 'Genesis 41:1-44:17; Numbers 28:9-15, 7:42-47',
  },
  {
    i: 11,
    dt: '2022-12-25',
    d: 'Chanukah: 8 Candles',
    n: 'Chanukah Day 7 (on Rosh Chodesh)',
    s: 'Numbers 28:1-15, 7:48-53',
  },
  {
    i: 12,
    dt: '2022-12-25',
    d: 'Rosh Chodesh Tevet',
    n: 'Chanukah Day 7 (on Rosh Chodesh)',
    s: 'Numbers 28:1-15, 7:48-53',
  },
  {
    i: 13,
    dt: '2022-12-26',
    d: 'Chanukah: 8th Day',
    n: 'Chanukah Day 8',
    s: 'Numbers 7:54-8:4',
  }];
  expect(actual).toEqual(expected);
});
