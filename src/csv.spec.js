/* eslint-disable require-jsdoc */
import test from 'ava';
import {Writable} from 'stream';
import {
  HDate,
  HebrewCalendar,
  HolidayEvent,
  ParshaEvent,
  RoshChodeshEvent,
  flags,
  months,
} from '@hebcal/core';
import {writeFullKriyahEvent} from './csv.js';

class StringWritable extends Writable {
  constructor(options) {
    super(options);
    this.chunks = [];
  }
  _write(chunk, encoding, callback) {
    this.chunks.push(chunk);
    callback();
  }
  toString() {
    return Buffer.concat(this.chunks).toString();
  }
}

test('writeFullKriyahEvent-parsha', (t) => {
  const ev = new ParshaEvent(new HDate(new Date(2020, 4, 16)), ['Behar', 'Bechukotai']);
  const stream = new StringWritable();
  writeFullKriyahEvent(stream, ev, false);
  const lines = stream.toString().split('\r\n');
  const expected = [
    '16-May-2020,"Behar-Bechukotai",1,"Leviticus 25:1-25:18",18',
    '16-May-2020,"Behar-Bechukotai",2,"Leviticus 25:19-25:28",10',
    '16-May-2020,"Behar-Bechukotai",3,"Leviticus 25:29-25:38",10',
    '16-May-2020,"Behar-Bechukotai",4,"Leviticus 25:39-26:9",26',
    '16-May-2020,"Behar-Bechukotai",5,"Leviticus 26:10-26:46",37',
    '16-May-2020,"Behar-Bechukotai",6,"Leviticus 27:1-27:15",15',
    '16-May-2020,"Behar-Bechukotai",7,"Leviticus 27:16-27:34",19',
    '16-May-2020,"Behar-Bechukotai","maf","Leviticus 27:32-27:34",3',
    '16-May-2020,"Behar-Bechukotai","Haftara","Jeremiah 16:19-17:14",17',
    '', ''];
  t.deepEqual(lines, expected);
});

test('writeFullKriyahEvent-holiday', (t) => {
  const ev = new HolidayEvent(new HDate(18, months.NISAN, 5764),
      'Pesach IV (CH\'\'M)', flags.CHUL_ONLY, {cholHaMoedDay: 2});
  const stream = new StringWritable();
  writeFullKriyahEvent(stream, ev, false);
  const lines = stream.toString().split('\r\n');
  const expected = [
    '09-Apr-2004,"Pesach Chol ha-Moed Day 2",1,"Exodus 22:24-22:26",3',
    '09-Apr-2004,"Pesach Chol ha-Moed Day 2",2,"Exodus 22:27-23:5",9',
    '09-Apr-2004,"Pesach Chol ha-Moed Day 2",3,"Exodus 23:6-23:19",14',
    '09-Apr-2004,"Pesach Chol ha-Moed Day 2",4,"Numbers 28:19-28:25",7',
    '', ''];
  t.deepEqual(lines, expected);
});

test('writeFullKriyahEvent-holiday-il', (t) => {
  const ev = new HolidayEvent(new HDate(18, months.NISAN, 5764),
      'Pesach IV (CH\'\'M)', flags.IL_ONLY, {cholHaMoedDay: 3});
  const stream = new StringWritable();
  writeFullKriyahEvent(stream, ev, true);
  const lines = stream.toString().split('\r\n');
  const expected = [
    `09-Apr-2004,"Pesach IV (CH''M)",1,"Exodus 22:24-22:26",3`,
    `09-Apr-2004,"Pesach IV (CH''M)",2,"Exodus 22:27-23:5",9`,
    `09-Apr-2004,"Pesach IV (CH''M)",3,"Exodus 23:6-23:19",14`,
    `09-Apr-2004,"Pesach IV (CH''M)",4,"Numbers 28:19-28:25",7`,
    '', ''];
  t.deepEqual(lines, expected);
});

test('writeFullKriyahEvent-RoshChodesh', (t) => {
  const ev = new RoshChodeshEvent(new HDate(1, months.SIVAN, 5782), 'Sivan');
  const stream = new StringWritable();
  writeFullKriyahEvent(stream, ev, false);
  const lines = stream.toString().split('\r\n');
  const expected = [
    '31-May-2022,"Rosh Chodesh Sivan",1,"Numbers 28:1-28:3",3',
    '31-May-2022,"Rosh Chodesh Sivan",2,"Numbers 28:3-28:5",3',
    '31-May-2022,"Rosh Chodesh Sivan",3,"Numbers 28:6-28:10",5',
    '31-May-2022,"Rosh Chodesh Sivan",4,"Numbers 28:11-28:15",5',
    '', ''];
  t.deepEqual(lines, expected);
});

test('writeFullKriyahEvent-9av', (t) => {
  const ev = new HolidayEvent(new HDate(9, months.AV, 5783), 'Tish\'a B\'Av', flags.MAJOR_FAST);
  const stream = new StringWritable();
  writeFullKriyahEvent(stream, ev, false);
  const lines = stream.toString().split('\r\n');
  const expected = [
    `27-Jul-2023,"Tish'a B'Av",1,"Deuteronomy 4:25-4:29",5`,
    `27-Jul-2023,"Tish'a B'Av",2,"Deuteronomy 4:30-4:35",6`,
    `27-Jul-2023,"Tish'a B'Av",3,"Deuteronomy 4:36-4:40",5`,
    `27-Jul-2023,"Tish'a B'Av","Haftara","Jeremiah 8:13-9:23",34`,
    '',
    `27-Jul-2023,"Tish'a B'Av (Mincha)",1,"Exodus 32:11-32:14",4`,
    `27-Jul-2023,"Tish'a B'Av (Mincha)",2,"Exodus 34:1-34:3",3`,
    `27-Jul-2023,"Tish'a B'Av (Mincha)","maf","Exodus 34:4-34:10",7`,
    `27-Jul-2023,"Tish'a B'Av (Mincha)","Haftara","Isaiah 55:6-56:8",16`,
    '', ''];
  t.deepEqual(lines, expected);
});

test.skip('writeFullKriyahEvent-SimchatTorah', (t) => {
  const events = HebrewCalendar.calendar({
    start: new HDate(22, months.TISHREI, 5784),
    end: new HDate(23, months.TISHREI, 5784),
    il: false,
  });
  t.is(events.length, 2);
  const stream = new StringWritable();
  events.forEach((ev) => writeFullKriyahEvent(stream, ev, false));
  const lines = stream.toString().split('\r\n');
  console.log(lines);
  // Erev Simchat Torah
  const expected = [
    '', ''];
  t.deepEqual(lines, expected);
});

test('writeFullKriyahEvent-shekalim', (t) => {
  const hd = new HDate(29, 'Adar I', 5784);
  const ev = new ParshaEvent(hd, ['Vayakhel'], false);
  const stream = new StringWritable();
  writeFullKriyahEvent(stream, ev, false);
  const lines = stream.toString().split('\r\n');
  const expected = [
    '09-Mar-2024,"Vayakhel",1,"Exodus 35:1-35:20",20',
    '09-Mar-2024,"Vayakhel",2,"Exodus 35:21-35:29",9',
    '09-Mar-2024,"Vayakhel",3,"Exodus 35:30-36:7",13',
    '09-Mar-2024,"Vayakhel",4,"Exodus 36:8-36:19",12',
    '09-Mar-2024,"Vayakhel",5,"Exodus 36:20-37:16",35',
    '09-Mar-2024,"Vayakhel",6,"Exodus 37:17-37:29",13',
    '09-Mar-2024,"Vayakhel",7,"Exodus 38:1-38:20",20',
    '09-Mar-2024,"Vayakhel","maf","Exodus 30:11-30:16 | Shabbat Shekalim",6',
    '09-Mar-2024,"Vayakhel","Haftara for Ashkenazim","II Kings 12:1-17 | Shabbat Shekalim",17',
    '09-Mar-2024,"Vayakhel","Haftara for Sephardim","II Kings 11:17-12:17 | Shabbat Shekalim",21',
    '', ''];
  t.deepEqual(lines, expected);
});
