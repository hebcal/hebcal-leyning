/* eslint-disable require-jsdoc */
import test from 'ava';
import {Writable} from 'stream';
import {HDate, HolidayEvent, RoshChodeshEvent, ParshaEvent, months, flags} from '@hebcal/core';
import {writeFullKriyahEvent} from './csv';

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
  const ev = new HolidayEvent(new HDate(18, months.NISAN, 5763),
      'Pesach IV (CH\'\'M)', flags.CHUL_ONLY, {cholHaMoedDay: 2});
  const stream = new StringWritable();
  writeFullKriyahEvent(stream, ev, false);
  const lines = stream.toString().split('\r\n');
  const expected = [
    '20-Apr-2003,"Pesach Chol ha-Moed Day 2",1,"Exodus 22:24-22:26",3',
    '20-Apr-2003,"Pesach Chol ha-Moed Day 2",2,"Exodus 22:27-23:5",9',
    '20-Apr-2003,"Pesach Chol ha-Moed Day 2",3,"Exodus 23:6-23:19",14',
    '20-Apr-2003,"Pesach Chol ha-Moed Day 2",4,"Numbers 28:19-28:25",7',
    '', ''];
  t.deepEqual(lines, expected);
});

test('writeFullKriyahEvent-holiday-il', (t) => {
  const ev = new HolidayEvent(new HDate(18, months.NISAN, 5763),
      'Pesach IV (CH\'\'M)', flags.IL_ONLY, {cholHaMoedDay: 3});
  const stream = new StringWritable();
  writeFullKriyahEvent(stream, ev, true);
  const lines = stream.toString().split('\r\n');
  const expected = [
    `20-Apr-2003,"Pesach IV (CH''M)",1,"Exodus 22:24-22:26",3`,
    `20-Apr-2003,"Pesach IV (CH''M)",2,"Exodus 22:27-23:5",9`,
    `20-Apr-2003,"Pesach IV (CH''M)",3,"Exodus 23:6-23:19",14`,
    `20-Apr-2003,"Pesach IV (CH''M)",4,"Numbers 28:19-28:25",7`,
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
