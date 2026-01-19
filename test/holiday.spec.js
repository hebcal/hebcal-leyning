import {expect, test} from 'vitest';
import {Event, HDate, HebrewCalendar, HolidayEvent, flags, months} from '@hebcal/core';
import {getLeyningForHoliday, getLeyningForHolidayKey} from '../src/getLeyningForHoliday';
import {getLeyningKeyForEvent} from '../src/getLeyningKeyForEvent';
import {formatAliyahWithBook} from '../src/common';
import '../src/locale';

test('pesach-il', () => {
  const events0 = HebrewCalendar.calendar({year: 5782, isHebrewYear: true, il: true});
  const events = events0.filter((ev) => ev.basename() === 'Pesach');
  const actual = [];
  for (const ev of events) {
    const reading = getLeyningForHoliday(ev, true);
    const readingHe = getLeyningForHoliday(ev, true, 'he');
    actual.push({
      h: ev.getDesc(),
      s: reading && reading.summary,
      he: readingHe && readingHe.summary,
    });
  }
  const expected = [
    {h: 'Erev Pesach', s: undefined, he: undefined},
    {h: 'Pesach I', s: 'Exodus 12:21-51; Numbers 28:16-25; Song of Songs 1:1-8:14', he: 'שְׁמוֹת יב:כא-נא; בְּמִדְבַּר כח:טז-כה; שִׁיר הַשִּׁירִים א:א-ח:יד'},
    {h: 'Pesach II (CH\'\'M)', s: 'Leviticus 22:26-23:44; Numbers 28:19-25', he: 'וַיִּקְרָא כב:כו-כג:מד; בְּמִדְבַּר כח:יט-כה'},
    {h: 'Pesach III (CH\'\'M)', s: 'Exodus 13:1-16; Numbers 28:19-25', he: 'שְׁמוֹת יג:א-טז; בְּמִדְבַּר כח:יט-כה'},
    {h: 'Pesach IV (CH\'\'M)', s: 'Exodus 22:24-23:19; Numbers 28:19-25', he: 'שְׁמוֹת כב:כד-כג:יט; בְּמִדְבַּר כח:יט-כה'},
    {h: 'Pesach V (CH\'\'M)', s: 'Exodus 34:1-26; Numbers 28:19-25', he: 'שְׁמוֹת לד:א-כו; בְּמִדְבַּר כח:יט-כה'},
    {h: 'Pesach VI (CH\'\'M)', s: 'Numbers 9:1-14, 28:19-25', he: 'בְּמִדְבַּר ט:א-יד, כח:יט-כה'},
    {h: 'Pesach VII', s: 'Exodus 13:17-15:26; Numbers 28:19-25', he: 'שְׁמוֹת יג:יז-טו:כו; בְּמִדְבַּר כח:יט-כה'},
  ];
  expect(actual).toEqual(expected);

  // Test Hebrew summaries
  const pesachI = events.find(ev => ev.getDesc() === 'Pesach I');
  const readingHe = getLeyningForHoliday(pesachI, true, 'he');
  expect(readingHe.name.he).toBe('פֶּסַח יוֹם א׳ (בְּשַׁבָּת)');
  expect(readingHe.summary).toBe('שְׁמוֹת יב:כא-נא; בְּמִדְבַּר כח:טז-כה; שִׁיר הַשִּׁירִים א:א-ח:יד');
  expect(readingHe.fullkriyah['1'].k).toBe('שְׁמוֹת');
  expect(readingHe.fullkriyah['M'].k).toBe('בְּמִדְבַּר');
  expect(readingHe.megillah['1'].k).toBe('שִׁיר הַשִּׁירִים');
});

test('pesach-shabbat-chm-on-3rd-day', () => {
  const events0 = HebrewCalendar.calendar({year: 5784, isHebrewYear: true, il: false});
  const events = events0.filter((ev) => ev.basename() === 'Pesach');
  const actual = [];
  for (const ev of events) {
    const reading = getLeyningForHoliday(ev, true);
    const readingHe = getLeyningForHoliday(ev, true, 'he');
    actual.push({
      d: ev.greg().toLocaleDateString('en-CA').substring(0, 10),
      h: ev.getDesc(),
      k: getLeyningKeyForEvent(ev, false),
      s: reading && reading.summary,
      he: readingHe && readingHe.summary,
    });
  }
  const expected = [
    {d: '2024-04-22', h: 'Erev Pesach', k: undefined, s: undefined, he: undefined},
    {
      d: '2024-04-23',
      h: 'Pesach I',
      k: 'Pesach I',
      s: 'Exodus 12:21-51; Numbers 28:16-25',
      he: 'שְׁמוֹת יב:כא-נא; בְּמִדְבַּר כח:טז-כה',
    },
    {
      d: '2024-04-24',
      h: 'Pesach II',
      k: 'Pesach II',
      s: 'Leviticus 22:26-23:44; Numbers 28:16-25',
      he: 'וַיִּקְרָא כב:כו-כג:מד; בְּמִדְבַּר כח:טז-כה',
    },
    {
      d: '2024-04-25',
      h: 'Pesach III (CH\'\'M)',
      k: 'Pesach Chol ha-Moed Day 1',
      s: 'Exodus 13:1-16; Numbers 28:19-25',
      he: 'שְׁמוֹת יג:א-טז; בְּמִדְבַּר כח:יט-כה',
    },
    {
      d: '2024-04-26',
      h: 'Pesach IV (CH\'\'M)',
      k: 'Pesach Chol ha-Moed Day 2',
      s: 'Exodus 22:24-23:19; Numbers 28:19-25',
      he: 'שְׁמוֹת כב:כד-כג:יט; בְּמִדְבַּר כח:יט-כה',
    },
    {
      d: '2024-04-27',
      h: 'Pesach V (CH\'\'M)',
      k: 'Pesach Shabbat Chol ha-Moed',
      s: 'Exodus 33:12-34:26; Numbers 28:19-25; Song of Songs 1:1-8:14',
      he: 'שְׁמוֹת לג:יב-לד:כו; בְּמִדְבַּר כח:יט-כה; שִׁיר הַשִּׁירִים א:א-ח:יד',
    },
    {
      d: '2024-04-28',
      h: 'Pesach VI (CH\'\'M)',
      k: 'Pesach Chol ha-Moed Day 4',
      s: 'Numbers 9:1-14, 28:19-25',
      he: 'בְּמִדְבַּר ט:א-יד, כח:יט-כה',
    },
    {
      d: '2024-04-29',
      h: 'Pesach VII',
      k: 'Pesach VII',
      s: 'Exodus 13:17-15:26; Numbers 28:19-25',
      he: 'שְׁמוֹת יג:יז-טו:כו; בְּמִדְבַּר כח:יט-כה',
    },
    {
      d: '2024-04-30',
      h: 'Pesach VIII',
      k: 'Pesach VIII',
      s: 'Deuteronomy 15:19-16:17; Numbers 28:19-25',
      he: 'דְּבָרִים טו:יט-טז:יז; בְּמִדְבַּר כח:יט-כה',
    },
  ];
  expect(actual).toEqual(expected);
});

// eslint-disable-next-line require-jsdoc
function formatAliyah(aliyot, num) {
  return formatAliyahWithBook(aliyot.fullkriyah[num]);
}

test('getLeyningForHoliday-il', () => {
  const options = {year: 5757, isHebrewYear: true, il: true};
  const events = HebrewCalendar.calendar(options);

  const sukkot1 = events.find((e) => e.getDesc() == 'Sukkot I');
  const sukkot1a = getLeyningForHoliday(sukkot1);
  expect(sukkot1a.fullkriyah['7'].p).toBe(31);
  expect(sukkot1a.summary).toBe('Leviticus 22:26-23:44; Numbers 29:12-16');

  const sukkot1He = getLeyningForHoliday(sukkot1, true, 'he');
  expect(sukkot1He.name.he).toBe('סוּכּוֹת יוֹם א׳ (בְּשַׁבָּת)');
  expect(sukkot1He.summary).toBe('וַיִּקְרָא כב:כו-כג:מד; בְּמִדְבַּר כט:יב-טז');
  expect(sukkot1He.fullkriyah['1'].k).toBe('וַיִּקְרָא');
  expect(sukkot1He.fullkriyah['M'].k).toBe('בְּמִדְבַּר');

  const sukkot2 = events.find((e) => e.getDesc() == 'Sukkot II (CH\'\'M)');
  expect(getLeyningForHoliday(sukkot2, true).fullkriyah['4'].p).toBe(41);
  const shminiAtzeret = events.find((e) => e.getDesc() == 'Shmini Atzeret');
  expect(getLeyningForHoliday(shminiAtzeret, true).fullkriyah['8'].p).toBe(1);
  const tevet17 = events.find((e) => e.getDesc() == 'Asara B\'Tevet');
  expect(getLeyningForHoliday(tevet17, true).fullkriyah['3'].e).toBe('34:10');
  const pesach5 = events.find((e) => e.getDesc() == 'Pesach V (CH\'\'M)');
  expect(getLeyningForHoliday(pesach5, true).fullkriyah['4'].p).toBe(21);
  const shavuot = events.find((e) => e.getDesc() == 'Shavuot');
  expect(getLeyningForHoliday(shavuot, true).fullkriyah['4'].p).toBe(17);

  const shavuotHe = getLeyningForHoliday(shavuot, true, 'he');
  expect(shavuotHe.name.he).toBe('שָׁבוּעוֹת');
  expect(shavuotHe.fullkriyah['1'].k).toBe('שְׁמוֹת');

  const av9 = events.find((e) => e.getDesc() == 'Tish\'a B\'Av');
  expect(getLeyningForHoliday(av9, true).haftara).toBe('Jeremiah 8:13-9:23');
});

test('getLeyningForHoliday-diaspora', () => {
  const events = HebrewCalendar.calendar({year: 5757, isHebrewYear: true, il: false});

  const sukkot1 = events.find((e) => e.getDesc() == 'Sukkot I');
  const sukkot1a = getLeyningForHoliday(sukkot1);
  expect(sukkot1a.fullkriyah['7'].p).toBe(31);
  expect(sukkot1a.summary).toBe('Leviticus 22:26-23:44; Numbers 29:12-16');
  const sukkot3 = events.find((e) => e.getDesc() == 'Sukkot III (CH\'\'M)');
  expect(getLeyningForHoliday(sukkot3, false).fullkriyah['4'].p).toBe(41);
  const shminiAtzeret = events.find((e) => e.getDesc() == 'Shmini Atzeret');
  expect(getLeyningForHoliday(shminiAtzeret, false).fullkriyah['7'].p).toBe(47);
  const tevet17 = events.find((e) => e.getDesc() == 'Asara B\'Tevet');
  expect(getLeyningForHoliday(tevet17, false).fullkriyah['3'].e).toBe('34:10');
  const pesach5 = events.find((e) => e.getDesc() == 'Pesach V (CH\'\'M)');
  expect(getLeyningForHoliday(pesach5, false).fullkriyah['4'].p).toBe(21);
  const shavuot = events.find((e) => e.getDesc() == 'Shavuot I');
  expect(getLeyningForHoliday(shavuot, false).fullkriyah['4'].p).toBe(17);
  const av9 = events.find((e) => e.getDesc() == 'Tish\'a B\'Av');
  expect(getLeyningForHoliday(av9, false).haftara).toBe('Jeremiah 8:13-9:23');
});


test('getLeyningForHoliday-Chanukah', () => {
  const options = {year: 5757, isHebrewYear: true, il: true};
  const events = HebrewCalendar.calendar(options);
  const chanukah3 = events.find((e) => e.getDesc() == 'Chanukah: 3 Candles');
  const reading = getLeyningForHoliday(chanukah3);
  const expected = {
    name: {en: 'Chanukah Day 2 (on Shabbat)', he: 'חֲנוּכָּה יוֹם ב׳ (בְּשַׁבָּת)'},
    type: 'holiday',
    fullkriyah: {M: {p: 35, k: 'Numbers', b: '7:18', e: '7:23', v: 6}},
    haft: {k: 'Zechariah', b: '2:14', e: '4:7', v: 21},
    haftara: 'Zechariah 2:14-4:7',
    haftaraNumV: 21,
  };
  expect(reading).toEqual(expected);

  const readingHe = getLeyningForHoliday(chanukah3, true, 'he');
  expect(readingHe.name).toEqual({en: 'Chanukah Day 2 (on Shabbat)', he: 'חֲנוּכָּה יוֹם ב׳ (בְּשַׁבָּת)'});
  expect(readingHe.fullkriyah.M.k).toBe('בְּמִדְבַּר');
  expect(readingHe.haft.k).toBe('זְכַרְיָה');
  expect(readingHe.haftara).toBe('זְכַרְיָה ב:יד-ד:ז');
});

test('getLeyningForHoliday-RoshChodesh', () => {
  const ev = new Event(new HDate(1, months.SIVAN, 5782),
      'Rosh Chodesh Sivan', flags.ROSH_CHODESH);
  const expected = {
    name: {
      en: 'Rosh Chodesh Sivan',
      he: 'רֹאשׁ חוֹדֶשׁ סִיוָן',
    },
    type: 'holiday',
    summary: 'Numbers 28:1-15',
    summaryParts: [{k: 'Numbers', b: '28:1', e: '28:15'}],
    fullkriyah: {
      '1': {p: 41, k: 'Numbers', b: '28:1', e: '28:3', v: 3},
      '2': {p: 41, k: 'Numbers', b: '28:3', e: '28:5', v: 3},
      '3': {p: 41, k: 'Numbers', b: '28:6', e: '28:10', v: 5},
      '4': {p: 41, k: 'Numbers', b: '28:11', e: '28:15', v: 5},
    },
  };
  const actual = getLeyningForHoliday(ev);
  expect(actual).toEqual(expected);

  const actualHe = getLeyningForHoliday(ev, false, 'he');
  expect(actualHe.name).toEqual({
    en: 'Rosh Chodesh Sivan',
    he: 'רֹאשׁ חוֹדֶשׁ סִיוָן',
  });
  expect(actualHe.summary).toBe('בְּמִדְבַּר כח:א-טו');
  expect(actualHe.fullkriyah['1'].k).toBe('בְּמִדְבַּר');
});

test('Rosh Chodesh Tevet', () => {
  const expectedDay6 = {
    name: {
      en: 'Chanukah Day 6',
      he: 'חֲנוּכָּה יוֹם ו׳',
    },
    type: 'holiday',
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
  expect(reading2).toEqual(expectedDay6);

  const rchTevet30kis = new Event(new HDate(30, months.KISLEV, 5787),
      'Rosh Chodesh Tevet', flags.ROSH_CHODESH);
  const reading3 = getLeyningForHoliday(rchTevet30kis);
  expect(reading3).toEqual(expectedDay6);

  const expectedDay7rch = {
    name: {
      en: 'Chanukah Day 7 (on Rosh Chodesh)',
      he: 'חֲנוּכָּה יוֹם ז׳ (רֹאשׁ חוֹדֶשׁ)',
    },
    type: 'holiday',
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
  expect(reading4).toEqual(expectedDay7rch);
});

test('getLeyningForHoliday-9av-obvs', () => {
  const ev = new Event(new HDate(10, months.AV, 5782),
      'Tish\'a B\'Av (observed)', flags.MAJOR_FAST, {observed: true});
  const expected = {
    name: {
      en: 'Tish\'a B\'Av',
      he: 'תִּשְׁעָה בְּאָב',
    },
    type: 'holiday',
    summary: 'Deuteronomy 4:25-40; Lamentations 1:1-5:22',
    summaryParts: [{k: 'Deuteronomy', b: '4:25', e: '4:40'}, {k: 'Lamentations', b: '1:1', e: '5:22'}],
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
    megillah: {
      '1': { k: 'Lamentations', b: '1:1', e: '1:22', v: 22 },
      '2': { k: 'Lamentations', b: '2:1', e: '2:22', v: 22 },
      '3': { k: 'Lamentations', b: '3:1', e: '3:66', v: 66 },
      '4': { k: 'Lamentations', b: '4:1', e: '4:22', v: 22 },
      '5': { k: 'Lamentations', b: '5:1', e: '5:22', v: 22 }
    },
  };
  const actual = getLeyningForHoliday(ev);
  expect(actual).toEqual(expected);

  const actualHe = getLeyningForHoliday(ev, false, 'he');
  expect(actualHe.type).toBe('holiday');
  expect(actualHe.name).toEqual({
    en: 'Tish\'a B\'Av',
    he: 'תִּשְׁעָה בְּאָב',
  });
  expect(actualHe.summary).toBe('דְּבָרִים ד:כה-מ; אֵיכָה א:א-ה:כב');
  expect(actualHe.summaryParts[0].k).toBe('דְּבָרִים');
  expect(actualHe.summaryParts[0].b).toBe('ד:כה');
  expect(actualHe.summaryParts[0].e).toBe('ד:מ');
  expect(actualHe.summaryParts[1].k).toBe('אֵיכָה');
  expect(actualHe.summaryParts[1].b).toBe('א:א');
  expect(actualHe.summaryParts[1].e).toBe('ה:כב');
  expect(actualHe.fullkriyah['1'].k).toBe('דְּבָרִים');
  expect(actualHe.haft.k).toBe('יִרְמְיָהוּ');
  expect(actualHe.haftara).toBe('יִרְמְיָהוּ ח:יג-ט:כג');
  expect(actualHe.haftaraNumV).toBe(34);
  expect(actualHe.megillah['1'].k).toBe('אֵיכָה');
  expect(actualHe.megillah['1'].b).toBe('א:א');
  expect(actualHe.megillah['1'].e).toBe('א:כב');
  expect(actualHe.megillah['5'].k).toBe('אֵיכָה');
});

test('shmini-atzeret', () => {
  const diaspora = HebrewCalendar.calendar({year: 2019, month: 10, il: false});
  const shminiDiaspora = diaspora.find((e) => e.getDesc() == 'Shmini Atzeret');
  expect(getLeyningForHoliday(shminiDiaspora, false).haftara).toBe('I Kings 8:54-66');

  const israel = HebrewCalendar.calendar({year: 2019, month: 10, il: true});
  const shminiIsrael = israel.find((e) => e.getDesc() == 'Shmini Atzeret');
  expect(getLeyningForHoliday(shminiIsrael, true).haftara).toBe('Joshua 1:1-18');
});

test('sukkot-shabbat-chm', () => {
  const diaspora = HebrewCalendar.calendar({year: 2019, month: 10, il: false});
  const sukkotShabbatD = diaspora.find((e) => e.getDesc() == 'Sukkot VI (CH\'\'M)');
  const a1 = getLeyningForHoliday(sukkotShabbatD);
  expect(a1.haftara).toBe('Ezekiel 38:18-39:16');
  expect(formatAliyah(a1, 'M')).toBe('Numbers 29:26-29:31');

  const israel = HebrewCalendar.calendar({year: 2017, month: 10, il: true});
  const sukkotShabbatIL = israel.find((e) => e.getDesc() == 'Sukkot III (CH\'\'M)');
  const a2 = getLeyningForHoliday(sukkotShabbatIL);
  expect(a2.haftara).toBe('Ezekiel 38:18-39:16');
  expect(formatAliyah(a2, 'M')).toBe('Numbers 29:20-29:25');
});

test('no-leyning-on-holiday', () => {
  const options = {year: 5757, isHebrewYear: true, il: true};
  const events = HebrewCalendar.calendar(options);
  const tuBiShvat = events.find((e) => e.getDesc() == 'Tu BiShvat');
  const a = getLeyningForHoliday(tuBiShvat);
  expect(a).toBe(undefined);
});

test('ignoreUserEvent-getLeyningForHoliday', () => {
  const ev = new Event(new HDate(20, months.TISHREI, 5780), 'Birthday', flags.USER_EVENT);
  const a = getLeyningForHoliday(ev);
  expect(a).toBe(undefined);
});

test('pesach-days-567', () => {
  const april20 = new Date(2022, 3, 20);
  const april22 = new Date(2022, 3, 22);
  const events = HebrewCalendar.calendar({start: april20, end: april22});
  const result = events.map((ev) => getLeyningForHoliday(ev, false));
  const expected = [{
    name: {
      en: 'Pesach Chol ha-Moed Day 3',
      he: 'פֶּסַח חוֹל הַמּוֹעֵד יוֹם ג׳',
    },
    type: 'holiday',
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
    type: 'holiday',
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
    type: 'holiday',
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
  expect(result).toEqual(expected);
});

test('israel-sukkot-chm-day5', () => {
  const october8 = new Date(2020, 9, 8);
  const israel = HebrewCalendar.calendar({
    il: true, start: october8, end: october8,
  });
  expect(israel[0].getDesc()).toBe('Sukkot VI (CH\'\'M)');
  const sukkotChmDay5 = getLeyningForHoliday(israel[0], true);
  expect(sukkotChmDay5).toEqual({
    name: {
      en: 'Sukkot Chol ha-Moed Day 5',
      he: 'סוּכּוֹת חוֹל הַמּוֹעֵד יוֹם ה׳',
    },
    type: 'holiday',
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

test('longest-holiday-haftarah', () => {
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
  expect(numverses).toBe(51);
  expect(holiday).toBe('Pesach VII');
});

test('Sukkot Shabbat Chol ha-Moed', () => {
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
    type: 'holiday',
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
    summary: 'Exodus 33:12-34:26; Numbers 29:26-31; Ecclesiastes 1:1-12:14',
    summaryParts: [
      {k: 'Exodus', b: '33:12', e: '34:26'},
      {k: 'Numbers', b: '29:26', e: '29:31'},
      {k: 'Ecclesiastes', b: '1:1', e: '12:14'},
    ],
    megillah: {
      '1': {k: 'Ecclesiastes', b: '1:1', e: '1:18', v: 18},
      '2': {k: 'Ecclesiastes', b: '2:1', e: '2:26', v: 26},
      '3': {k: 'Ecclesiastes', b: '3:1', e: '3:22', v: 22},
      '4': {k: 'Ecclesiastes', b: '4:1', e: '4:17', v: 17},
      '5': {k: 'Ecclesiastes', b: '5:1', e: '5:19', v: 19},
      '6': {k: 'Ecclesiastes', b: '6:1', e: '6:12', v: 12},
      '7': {k: 'Ecclesiastes', b: '7:1', e: '7:29', v: 29},
      '8': {k: 'Ecclesiastes', b: '8:1', e: '8:17', v: 17},
      '9': {k: 'Ecclesiastes', b: '9:1', e: '9:18', v: 18},
      '10': {k: 'Ecclesiastes', b: '10:1', e: '10:20', v: 20},
      '11': {k: 'Ecclesiastes', b: '11:1', e: '11:10', v: 10},
      '12': {k: 'Ecclesiastes', b: '12:1', e: '12:14', v: 14},
    },
    haft: {k: 'Ezekiel', b: '38:18', e: '39:16', v: 22},
    haftara: 'Ezekiel 38:18-39:16',
    haftaraNumV: 22,
  };
  expect(reading).toEqual(expected);
});

test('17tamuz', () => {
  const hd = new HDate(17, 'Tamuz', 5783);
  const events = HebrewCalendar.calendar({
    start: hd,
    end: hd,
  });
  const reading = getLeyningForHoliday(events[0]);
  const expected = {
    name: {en: 'Tzom Tammuz', he: 'צוֹם י״ז בְּתַמּוּז'},
    type: 'holiday',
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
  expect(reading).toEqual(expected);
});

test('9av', () => {
  const hd = new HDate(9, 'Av', 5783);
  const events = HebrewCalendar.calendar({
    start: hd,
    end: hd,
  });
  const reading = getLeyningForHoliday(events[0]);
  const expected = {
    name: {en: 'Tish\'a B\'Av', he: 'תִּשְׁעָה בְּאָב'},
    type: 'holiday',
    fullkriyah: {
      '1': {p: 45, k: 'Deuteronomy', b: '4:25', e: '4:29', v: 5},
      '2': {p: 45, k: 'Deuteronomy', b: '4:30', e: '4:35', v: 6},
      '3': {p: 45, k: 'Deuteronomy', b: '4:36', e: '4:40', v: 5},
    },
    summary: 'Deuteronomy 4:25-40; Lamentations 1:1-5:22',
    summaryParts: [{k: 'Deuteronomy', b: '4:25', e: '4:40'}, {k: 'Lamentations', b: '1:1', e: '5:22'}],
    haft: {k: 'Jeremiah', b: '8:13', e: '9:23', v: 34},
    haftara: 'Jeremiah 8:13-9:23',
    haftaraNumV: 34,
    megillah: {
      '1': { k: 'Lamentations', b: '1:1', e: '1:22', v: 22 },
      '2': { k: 'Lamentations', b: '2:1', e: '2:22', v: 22 },
      '3': { k: 'Lamentations', b: '3:1', e: '3:66', v: 66 },
      '4': { k: 'Lamentations', b: '4:1', e: '4:22', v: 22 },
      '5': { k: 'Lamentations', b: '5:1', e: '5:22', v: 22 }
    },
  };
  expect(reading).toEqual(expected);
});

test('fast day mincha', () => {
  const reading = getLeyningForHolidayKey('Tish\'a B\'Av (Mincha)');
  const expected = {
    name: {en: 'Tish\'a B\'Av (Mincha)', he: 'תִּשְׁעָה בְּאָב (מִנְחָה)'},
    type: 'holiday',
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
  expect(reading).toEqual(expected);

  const reading2 = getLeyningForHolidayKey('Tzom Gedaliah (Mincha)');
  expected.name = {en: 'Tzom Gedaliah (Mincha)', he: 'צוֹם גְּדַלְיָה (מִנְחָה)'};
  expect(reading2).toEqual(expected);

  const reading3 = getLeyningForHolidayKey('Ta\'anit Esther (Mincha)');
  expected.name = {en: 'Ta\'anit Esther (Mincha)', he: 'תַּעֲנִית אֶסְתֵּר (מִנְחָה)'};
  expect(reading3).toEqual(expected);
});

test('pesach-diaspora-chm-day2-sunday', () => {
  const events0 = HebrewCalendar.calendar({year: 5783, isHebrewYear: true, il: false});
  const events = events0.filter((ev) => ev.basename() === 'Pesach' && ev.cholHaMoedDay);
  const actual = events.map((ev) => {
    const reading = getLeyningForHoliday(ev);
    return {
      d: ev.greg().toLocaleDateString('en-CA').substring(0, 10),
      h: ev.getDesc(),
      n: reading.name.en,
      s: reading.summary,
    };
  });
  const expected = [
    {
      d: '2023-04-08',
      h: 'Pesach III (CH\'\'M)',
      n: 'Pesach Shabbat Chol ha-Moed',
      s: 'Exodus 33:12-34:26; Numbers 28:19-25; Song of Songs 1:1-8:14',
    },
    {
      d: '2023-04-09',
      h: 'Pesach IV (CH\'\'M)',
      n: 'Pesach Chol ha-Moed Day 2 on Sunday',
      s: 'Exodus 13:1-16; Numbers 28:19-25',
    },
    {
      d: '2023-04-10',
      h: 'Pesach V (CH\'\'M)',
      n: 'Pesach Chol ha-Moed Day 3 on Monday',
      s: 'Exodus 22:24-23:19; Numbers 28:19-25',
    },
    {
      d: '2023-04-11',
      h: 'Pesach VI (CH\'\'M)',
      n: 'Pesach Chol ha-Moed Day 4',
      s: 'Numbers 9:1-14, 28:19-25',
    },
  ];
  expect(actual).toEqual(expected);
});

test('Shavuot Israel', () => {
  const events0 = HebrewCalendar.calendar({year: 5783, isHebrewYear: true, il: true});
  const events = events0.filter((ev) => ev.getDesc() === 'Shavuot');
  const actual = getLeyningForHoliday(events[0], true);
  const expected = {
    '1': {k: 'Ruth', b: '1:1', e: '1:22', v: 22},
    '2': {k: 'Ruth', b: '2:1', e: '2:23', v: 23},
    '3': {k: 'Ruth', b: '3:1', e: '3:18', v: 18},
    '4': {k: 'Ruth', b: '4:1', e: '4:22', v: 22},
  };
  expect(actual.megillah).toEqual(expected);
});

test('Shavuot Diaspora', () => {
  const events0 = HebrewCalendar.calendar({year: 5783, isHebrewYear: true, il: false});
  const events = events0.filter((ev) => ev.basename() === 'Shavuot');
  expect(events[0].getDesc()).toBe('Erev Shavuot');
  expect(getLeyningForHoliday(events[0])).toBe(undefined);
  expect(events[1].getDesc()).toBe('Shavuot I');
  expect(getLeyningForHoliday(events[1]).megillah).toBe(undefined);
  expect(events[2].getDesc()).toBe('Shavuot II');
  expect(getLeyningForHoliday(events[2]).megillah).toEqual({
    '1': {k: 'Ruth', b: '1:1', e: '1:22', v: 22},
    '2': {k: 'Ruth', b: '2:1', e: '2:23', v: 23},
    '3': {k: 'Ruth', b: '3:1', e: '3:18', v: 18},
    '4': {k: 'Ruth', b: '4:1', e: '4:22', v: 22},
  });
});

test('Erev Purim', () => {
  const events0 = HebrewCalendar.calendar({year: 5783, isHebrewYear: true, il: false});
  const events = events0.filter((ev) => ev.getDesc() === 'Erev Purim');
  const actual = getLeyningForHoliday(events[0]);
  const expected = {
    name: {en: 'Erev Purim', he: 'עֶרֶב פּוּרִים'},
    type: 'holiday',
    megillah: {
      '1': {k: 'Esther', b: '1:1', e: '1:22', v: 22},
      '2': {k: 'Esther', b: '2:1', e: '2:23', v: 23},
      '3': {k: 'Esther', b: '3:1', e: '3:15', v: 15},
      '4': {k: 'Esther', b: '4:1', e: '4:17', v: 17},
      '5': {k: 'Esther', b: '5:1', e: '5:14', v: 14},
      '6': {k: 'Esther', b: '6:1', e: '6:14', v: 14},
      '7': {k: 'Esther', b: '7:1', e: '7:10', v: 10},
      '8': {k: 'Esther', b: '8:1', e: '8:17', v: 17},
      '9': {k: 'Esther', b: '9:1', e: '9:32', v: 32},
      '10': {k: 'Esther', b: '10:1', e: '10:3', v: 3},
    },
    summary: 'Esther 1:1-10:3',
  };
  expect(actual).toEqual(expected);

  const actualHe = getLeyningForHoliday(events[0], false, 'he');
  expect(actualHe.name).toEqual({en: 'Erev Purim', he: 'עֶרֶב פּוּרִים'});
  expect(actualHe.summary).toBe('אֶסְתֵּר א:א-י:ג');
  expect(actualHe.megillah['1'].k).toBe('אֶסְתֵּר');
  expect(actualHe.megillah['10'].k).toBe('אֶסְתֵּר');
});

test('getLeyningForHoliday-note', () => {
  const ev = new HolidayEvent(new HDate(15, months.ADAR_II, 5784),
      'Shushan Purim', flags.MINOR_HOLIDAY);
  const reading = getLeyningForHoliday(ev, true);
  expect(reading.note).toBe('Jerusalem & walled cities only');
});

test('getLeyningForHolidayKey-note', () => {
  const reading = getLeyningForHolidayKey('Shushan Purim', undefined, true);
  expect(reading.note).toBe('Jerusalem & walled cities only');
});

test('Erev Simchat Torah', () => {
  // Disapora
  const ev = new HolidayEvent(new HDate(22, months.TISHREI, 5783),
      'Erev Simchat Torah', flags.EREV);
  const reading = getLeyningForHoliday(ev, false);
  const expected = {
    name: {en: 'Erev Simchat Torah', he: 'עֶרֶב שִׂמְחַת תּוֹרָה'},
    type: 'holiday',
    fullkriyah: {
      '1': {p: 54, k: 'Deuteronomy', b: '33:1', e: '33:7', v: 7},
      '2': {p: 54, k: 'Deuteronomy', b: '33:8', e: '33:12', v: 5},
      '3': {p: 54, k: 'Deuteronomy', b: '33:13', e: '33:17', v: 5},
    },
    summary: 'Deuteronomy 33:1-17',
    summaryParts: [{k: 'Deuteronomy', b: '33:1', e: '33:17'}],
  };
  expect(reading).toEqual(expected);

  // Israel
  const ev2 = new HolidayEvent(new HDate(21, months.TISHREI, 5783),
      'Erev Simchat Torah', flags.EREV);
  const reading2 = getLeyningForHoliday(ev2, true);
  expect(reading2).toEqual(expected);
});

const megillahCases = [
  {
    name: 'Pesach',
    startDate: [15, months.NISAN],
    numDays: 7,
    expectedMegillah: 'Song of Songs',
  },
  {
    name: 'Sukkot',
    startDate: [15, months.TISHREI],
    numDays: 8,
    expectedMegillah: 'Ecclesiastes',
  },
];

for (const testCase of megillahCases) {
  for (const il of [true, false]) {
    for (let year = 5780; year < 5830; year++) {
      test(`${testCase.name} on ${year} in ${il ? 'Israel' : 'disaspora'}`, () => {
        const start = new HDate(...testCase.startDate, year);
        const events = HebrewCalendar.calendar({
          start,
          end: start.add(testCase.numDays + (il ? 0 : 1) - 1, 'days'),
          il,
        });
        const leynings = events.map(e => getLeyningForHoliday(e, il));

        const megillahLeynings = leynings.filter(o => o.megillah);
        expect(megillahLeynings).toHaveLength(1);
        expect(megillahLeynings[0].name.en).toContain('Shabbat');

        // Megillah is rarely leined on the first day.
        if (!il || testCase.name !== 'Pesach')
          expect(megillahLeynings[0]).not.toBe(leynings[0]);
      });
    }
  }
}

test('alt', () => {
  const reading = getLeyningForHolidayKey('Chanukah Day 1');
  const expected = {
    name: { en: 'Chanukah Day 1', he: 'חֲנוּכָּה יוֹם א׳' },
    type: 'holiday',
    fullkriyah: {
      '1': { p: 35, k: 'Numbers', b: '7:1', e: '7:11', v: 11 },
      '2': { p: 35, k: 'Numbers', b: '7:12', e: '7:14', v: 3 },
      '3': { p: 35, k: 'Numbers', b: '7:15', e: '7:17', v: 3 }
    },
    summary: 'Numbers 7:1-17',
    summaryParts: [ { k: 'Numbers', b: '7:1', e: '7:17' } ],
    alt: {
      '1': { p: 35, k: 'Numbers', b: '7:1', e: '7:3', v: 3 },
      '2': { p: 35, k: 'Numbers', b: '7:4', e: '7:11', v: 8 },
      '3': { p: 35, k: 'Numbers', b: '7:12', e: '7:17', v: 6 }
    }
  };
  expect(reading).toEqual(expected);
});
