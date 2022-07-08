/* eslint-disable require-jsdoc */
import test from 'ava';
import {Writable} from 'stream';
import {HDate, HolidayEvent, RoshChodeshEvent, ParshaEvent, months, flags} from '@hebcal/core';
import {writeFullKriyahEvent, writeTriennialEvent} from './csv';

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

test('writeTriennialEvent-parsha', (t) => {
  const ev = new ParshaEvent(new HDate(new Date(2022, 3, 30)), ['Achrei Mot']);
  const stream = new StringWritable();
  writeTriennialEvent(stream, ev);
  const lines = stream.toString().split('\r\n');
  const expected = [
    '30-Apr-2022,"Achrei Mot",1,"Leviticus 17:1-17:7",7',
    '30-Apr-2022,"Achrei Mot",2,"Leviticus 17:8-17:12",5',
    '30-Apr-2022,"Achrei Mot",3,"Leviticus 17:13-17:16",4',
    '30-Apr-2022,"Achrei Mot",4,"Leviticus 18:1-18:5",5',
    '30-Apr-2022,"Achrei Mot",5,"Leviticus 18:6-18:21",16',
    '30-Apr-2022,"Achrei Mot",6,"Leviticus 18:22-18:25",4',
    '30-Apr-2022,"Achrei Mot",7,"Leviticus 18:26-18:30",5',
    '30-Apr-2022,"Achrei Mot","maf","Leviticus 18:26-18:30",5',
    '30-Apr-2022,"Achrei Mot","Haftara","I Samuel 20:18-42 | Shabbat Machar Chodesh",25',
    '', ''];
  t.deepEqual(lines, expected);
});

test('writeTriennialEvent-holiday', (t) => {
  const ev = new HolidayEvent(new HDate(6, months.SIVAN, 5777),
      'Shavuot I', flags.CHAG | flags.LIGHT_CANDLES_TZEIS | flags.CHUL_ONLY);
  const stream = new StringWritable();
  writeTriennialEvent(stream, ev);
  const lines = stream.toString().split('\r\n');
  const expected = [
    '31-May-2017,"Shavuot I",1,"Exodus 19:1-19:6",6',
    '31-May-2017,"Shavuot I",2,"Exodus 19:7-19:13",7',
    '31-May-2017,"Shavuot I",3,"Exodus 19:14-19:19",6',
    '31-May-2017,"Shavuot I",4,"Exodus 19:20-20:14",20',
    '31-May-2017,"Shavuot I",5,"Exodus 20:15-20:23",9',
    '31-May-2017,"Shavuot I","maf","Numbers 28:26-28:31",6',
    '31-May-2017,"Shavuot I","Haftara","Ezekiel 1:1-28; 3:12",29',
    '', ''];
  t.deepEqual(lines, expected);
});

test('writeTriennialEvent-parsha-alt-haftara', (t) => {
  const ev = new ParshaEvent(new HDate(new Date(2016, 10, 19)), ['Vayera']);
  const stream = new StringWritable();
  writeTriennialEvent(stream, ev);
  const lines = stream.toString().split('\r\n');
  const expected = [
    '19-Nov-2016,"Vayera",1,"Genesis 18:1-18:5",5',
    '19-Nov-2016,"Vayera",2,"Genesis 18:6-18:8",3',
    '19-Nov-2016,"Vayera",3,"Genesis 18:9-18:14",6',
    '19-Nov-2016,"Vayera",4,"Genesis 18:15-18:21",7',
    '19-Nov-2016,"Vayera",5,"Genesis 18:22-18:26",5',
    '19-Nov-2016,"Vayera",6,"Genesis 18:27-18:30",4',
    '19-Nov-2016,"Vayera",7,"Genesis 18:31-18:33",3',
    '19-Nov-2016,"Vayera","maf","Genesis 18:31-18:33",3',
    '19-Nov-2016,"Vayera","Haftara","II Kings 4:1-37",37',
    '19-Nov-2016,"Vayera","Haftara for Sephardim","II Kings 4:1-23",23',
    '19-Nov-2016,"Vayera","Alternate Haftara","II Kings 4:8-17",10',
    '', ''];
  t.deepEqual(lines, expected);
});

test('writeTriennialEvent-holiday-alt-haftara', (t) => {
  const ev = new HolidayEvent(new HDate(16, months.TISHREI, 5789),
      'Sukkot II', flags.CHAG | flags.YOM_TOV_ENDS | flags.CHUL_ONLY);
  const stream = new StringWritable();
  writeTriennialEvent(stream, ev);
  const lines = stream.toString().split('\r\n');
  const expected = [
    '06-Oct-2028,"Sukkot II",1,"Leviticus 22:26-23:3",11',
    '06-Oct-2028,"Sukkot II",2,"Leviticus 23:4-23:14",11',
    '06-Oct-2028,"Sukkot II",3,"Leviticus 23:15-23:22",8',
    '06-Oct-2028,"Sukkot II",4,"Leviticus 23:23-23:32",10',
    '06-Oct-2028,"Sukkot II",5,"Leviticus 23:33-23:44",12',
    '06-Oct-2028,"Sukkot II","maf","Numbers 29:12-29:16",5',
    '06-Oct-2028,"Sukkot II","Haftara","I Kings 8:2-21",20',
    '06-Oct-2028,"Sukkot II","Alternate Haftara","I Kings 8:2-13",12',
    '', ''];
  t.deepEqual(lines, expected);
});
