import {expect, test} from 'vitest';
import {Writable} from 'node:stream';
import {
  HDate,
  HebrewCalendar,
  HolidayEvent,
  ParshaEvent,
  RoshChodeshEvent,
  flags,
  months,
} from '@hebcal/core';
import {writeFullKriyahEvent, writeFullKriyahCsv, getParshaDates} from '../src/csv';

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

test('writeFullKriyahEvent-parsha', () => {
  const ev = new ParshaEvent({
    hdate: new HDate(new Date(2020, 4, 16)),
    parsha: ['Behar', 'Bechukotai'],
  });
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
  expect(lines).toEqual(expected);
});

test('writeFullKriyahEvent-holiday', () => {
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
  expect(lines).toEqual(expected);
});

test('writeFullKriyahEvent-holiday-il', () => {
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
  expect(lines).toEqual(expected);
});

test('writeFullKriyahEvent-RoshChodesh', () => {
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
  expect(lines).toEqual(expected);
});

test('writeFullKriyahEvent-9av', () => {
  const ev = new HolidayEvent(new HDate(9, months.AV, 5783), 'Tish\'a B\'Av', flags.MAJOR_FAST);
  const stream = new StringWritable();
  writeFullKriyahEvent(stream, ev, false);
  const lines = stream.toString().split('\r\n');
  const expected = [
    `27-Jul-2023,"Tish'a B'Av",1,"Deuteronomy 4:25-4:29",5`,
    `27-Jul-2023,"Tish'a B'Av",2,"Deuteronomy 4:30-4:35",6`,
    `27-Jul-2023,"Tish'a B'Av",3,"Deuteronomy 4:36-4:40",5`,
    `27-Jul-2023,"Tish'a B'Av","Haftara","Jeremiah 8:13-9:23",34`,
    `27-Jul-2023,"Tish'a B'Av","Megillah Ch. 1","Lamentations 1:1-1:22",22`,
    `27-Jul-2023,"Tish'a B'Av","Megillah Ch. 2","Lamentations 2:1-2:22",22`,
    `27-Jul-2023,"Tish'a B'Av","Megillah Ch. 3","Lamentations 3:1-3:66",66`,
    `27-Jul-2023,"Tish'a B'Av","Megillah Ch. 4","Lamentations 4:1-4:22",22`,
    `27-Jul-2023,"Tish'a B'Av","Megillah Ch. 5","Lamentations 5:1-5:22",22`,
    '',
    `27-Jul-2023,"Tish'a B'Av (Mincha)",1,"Exodus 32:11-32:14",4`,
    `27-Jul-2023,"Tish'a B'Av (Mincha)",2,"Exodus 34:1-34:3",3`,
    `27-Jul-2023,"Tish'a B'Av (Mincha)","maf","Exodus 34:4-34:10",7`,
    `27-Jul-2023,"Tish'a B'Av (Mincha)","Haftara","Isaiah 55:6-56:8",16`,
    '', ''];
  expect(lines).toEqual(expected);
});

test('writeFullKriyahEvent-SimchatTorah', () => {
  const events = HebrewCalendar.calendar({
    start: new HDate(22, months.TISHREI, 5783),
    end: new HDate(23, months.TISHREI, 5783),
    il: false,
  });
  expect(events.length).toBe(2);
  const stream = new StringWritable();
  events.forEach((ev) => writeFullKriyahEvent(stream, ev, false));
  const lines = stream.toString().split('\r\n');
  // Erev Simchat Torah
  const expected = [
    '17-Oct-2022,"Shmini Atzeret",1,"Deuteronomy 14:22-14:29",8',
    '17-Oct-2022,"Shmini Atzeret",2,"Deuteronomy 15:1-15:18",18',
    '17-Oct-2022,"Shmini Atzeret",3,"Deuteronomy 15:19-16:3",8',
    '17-Oct-2022,"Shmini Atzeret",4,"Deuteronomy 16:4-16:8",5',
    '17-Oct-2022,"Shmini Atzeret",5,"Deuteronomy 16:9-16:17",9',
    '17-Oct-2022,"Shmini Atzeret","maf","Numbers 29:35-30:1",6',
    '17-Oct-2022,"Shmini Atzeret","Haftara","I Kings 8:54-66",13',
    '',
    '17-Oct-2022,"Erev Simchat Torah",1,"Deuteronomy 33:1-33:7",7',
    '17-Oct-2022,"Erev Simchat Torah",2,"Deuteronomy 33:8-33:12",5',
    '17-Oct-2022,"Erev Simchat Torah",3,"Deuteronomy 33:13-33:17",5',
    '',
    '18-Oct-2022,"Simchat Torah",1,"Deuteronomy 33:1-33:7",7',
    '18-Oct-2022,"Simchat Torah",2,"Deuteronomy 33:8-33:12",5',
    '18-Oct-2022,"Simchat Torah",3,"Deuteronomy 33:13-33:17",5',
    '18-Oct-2022,"Simchat Torah",4,"Deuteronomy 33:18-33:21",4',
    '18-Oct-2022,"Simchat Torah",5,"Deuteronomy 33:22-33:26",5',
    '18-Oct-2022,"Simchat Torah",6,"Deuteronomy 33:27-34:12",15',
    '18-Oct-2022,"Simchat Torah",7,"Genesis 1:1-2:3",34',
    '18-Oct-2022,"Simchat Torah","maf","Numbers 29:35-30:1",6',
    '18-Oct-2022,"Simchat Torah","Haftara","Joshua 1:1-18",18',
    '', ''];
  expect(lines).toEqual(expected);
});

test('writeFullKriyahEvent-shekalim', () => {
  const hd = new HDate(29, 'Adar I', 5784);
  const ev = new ParshaEvent({hdate: hd, parsha: ['Vayakhel'], il: false});
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
  expect(lines).toEqual(expected);
});

test('writeFullKriyahEvent-ignores-SPECIAL_SHABBAT', () => {
  const ev = new HolidayEvent(
    new HDate(25, months.ADAR_I, 5784),
    'Shabbat Shekalim',
    flags.SPECIAL_SHABBAT
  );
  const stream = new StringWritable();
  writeFullKriyahEvent(stream, ev, false);
  expect(stream.toString()).toBe('');
});

test('writeFullKriyahEvent-ignores-RoshChodesh-on-Shabbat', () => {
  // 1 Adar I 5784 = Sat 10 Feb 2024
  const hd = new HDate(1, months.ADAR_I, 5784);
  expect(hd.getDay()).toBe(6); // verify it's Saturday
  const ev = new RoshChodeshEvent(hd, 'Adar I');
  const stream = new StringWritable();
  writeFullKriyahEvent(stream, ev, false);
  expect(stream.toString()).toBe('');
});

test('writeFullKriyahEvent-Purim', () => {
  // Purim 5784 = Sun 24 Mar 2024 (leap year, so 14 Adar II)
  const ev = new HolidayEvent(
    new HDate(14, months.ADAR_II, 5784),
    'Purim',
    flags.MINOR_HOLIDAY
  );
  const stream = new StringWritable();
  writeFullKriyahEvent(stream, ev, false);
  const lines = stream.toString().split('\r\n');
  const expected = [
    '24-Mar-2024,"Purim",1,"Exodus 17:8-17:10",3',
    '24-Mar-2024,"Purim",2,"Exodus 17:11-17:13",3',
    '24-Mar-2024,"Purim",3,"Exodus 17:14-17:16",3',
    '24-Mar-2024,"Purim","Megillah Ch. 1","Esther 1:1-1:22",22',
    '24-Mar-2024,"Purim","Megillah Ch. 2","Esther 2:1-2:23",23',
    '24-Mar-2024,"Purim","Megillah Ch. 3","Esther 3:1-3:15",15',
    '24-Mar-2024,"Purim","Megillah Ch. 4","Esther 4:1-4:17",17',
    '24-Mar-2024,"Purim","Megillah Ch. 5","Esther 5:1-5:14",14',
    '24-Mar-2024,"Purim","Megillah Ch. 6","Esther 6:1-6:14",14',
    '24-Mar-2024,"Purim","Megillah Ch. 7","Esther 7:1-7:10",10',
    '24-Mar-2024,"Purim","Megillah Ch. 8","Esther 8:1-8:17",17',
    '24-Mar-2024,"Purim","Megillah Ch. 9","Esther 9:1-9:32",32',
    '24-Mar-2024,"Purim","Megillah Ch. 10","Esther 10:1-10:3",3',
    '', ''];
  expect(lines).toEqual(expected);
});

test('writeFullKriyahEvent-IL-HoshanaRaba', () => {
  // In IL mode, Sukkot VII (Hoshana Raba) appends Erev Simchat Torah reading
  const events = HebrewCalendar.calendar({
    start: new HDate(21, months.TISHREI, 5783),
    end: new HDate(21, months.TISHREI, 5783),
    il: true,
  });
  expect(events.length).toBe(1);
  const stream = new StringWritable();
  writeFullKriyahEvent(stream, events[0], true);
  const lines = stream.toString().split('\r\n');
  const expected = [
    '16-Oct-2022,"Sukkot Final Day (Hoshana Raba)",1,"Numbers 29:26-29:28",3',
    '16-Oct-2022,"Sukkot Final Day (Hoshana Raba)",2,"Numbers 29:29-29:31",3',
    '16-Oct-2022,"Sukkot Final Day (Hoshana Raba)",3,"Numbers 29:32-29:34",3',
    '16-Oct-2022,"Sukkot Final Day (Hoshana Raba)",4,"Numbers 29:29-29:34",6',
    '',
    '16-Oct-2022,"Erev Simchat Torah",1,"Deuteronomy 33:1-33:7",7',
    '16-Oct-2022,"Erev Simchat Torah",2,"Deuteronomy 33:8-33:12",5',
    '16-Oct-2022,"Erev Simchat Torah",3,"Deuteronomy 33:13-33:17",5',
    '', ''];
  expect(lines).toEqual(expected);
});

test('getParshaDates', () => {
  const ev1 = new ParshaEvent({hdate: new HDate(4, months.TISHREI, 5784), parsha: ["Ha'azinu"]});
  const ev2 = new ParshaEvent({hdate: new HDate(11, months.TISHREI, 5784), parsha: ["Ha'azinu"]});
  const holiday = new HolidayEvent(
    new HDate(10, months.TISHREI, 5784),
    'Yom Kippur',
    flags.YOM_TOV_ENDS
  );
  const result = getParshaDates([ev1, ev2, holiday]);
  expect(result).toEqual({
    '4 Tishrei 5784': true,
    '11 Tishrei 5784': true,
  });
});

test('writeFullKriyahCsv-header', () => {
  const stream = new StringWritable();
  writeFullKriyahCsv(stream, 5784, false);
  const output = stream.toString();
  const firstLine = output.split('\r\n')[0];
  expect(firstLine).toBe('"Date","Parashah","Aliyah","Reading","Verses"');
  // Rosh Chodesh Tevet is always excluded
  expect(output).not.toContain('Rosh Chodesh Tevet');
});
