import test from 'ava';
import {HebrewCalendar} from '@hebcal/core';
import {Triennial, getTriennialForParshaHaShavua} from './triennial';
import {formatAliyahWithBook} from './leyning';

test('triennial', (t) => {
  const tri = new Triennial(5777);
  const readings = tri.getReadings();
  const parsha = readings.get('Vayakhel-Pekudei');
  t.is(parsha.length, 2);
  t.is(parsha[0]['7'].k, 'Exodus');
  t.is(parsha[0]['7'].b, '37:1');
  t.is(parsha[0]['7'].e, '37:16');
  t.is(parsha[1]['7'].k, 'Exodus');
  t.is(parsha[1]['7'].b, '39:8');
  t.is(parsha[1]['7'].e, '39:21');
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
});
