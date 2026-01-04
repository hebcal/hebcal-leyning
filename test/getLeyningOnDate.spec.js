import {expect, test} from 'vitest';
import {HDate, months} from '@hebcal/core';
import {getLeyningOnDate} from '../src/getLeyningOnDate';

test('getLeyningOnDate-parsha', () => {
  const hd = new HDate(16, 'Av', 5782);
  const reading = getLeyningOnDate(hd, false);
  const expected = {
    name: {
      en: 'Vaetchanan',
      he: 'וָאֶתְחַנַּן',
    },
    type: 'shabbat',
    parsha: [
      'Vaetchanan',
    ],
    parshaNum: 45,
    summary: 'Deuteronomy 3:23-7:11',
    fullkriyah: {
      '1': {k: 'Deuteronomy', b: '3:23', e: '4:4', v: 11},
      '2': {k: 'Deuteronomy', b: '4:5', e: '4:40', v: 36},
      '3': {k: 'Deuteronomy', b: '4:41', e: '4:49', v: 9},
      '4': {k: 'Deuteronomy', b: '5:1', e: '5:18', v: 18},
      '5': {k: 'Deuteronomy', b: '5:19', e: '6:3', v: 15},
      '6': {k: 'Deuteronomy', b: '6:4', e: '6:25', v: 22},
      '7': {k: 'Deuteronomy', b: '7:1', e: '7:11', v: 11},
      'M': {k: 'Deuteronomy', b: '7:9', e: '7:11', v: 3},
    },
    haft: {k: 'Isaiah', b: '40:1', e: '40:26', v: 26},
    haftara: 'Isaiah 40:1-26',
    haftaraNumV: 26,
  };
  expect(reading).toEqual(expected);

  const readingHe = getLeyningOnDate(hd, false, false, 'he');
  expect(readingHe.name).toEqual({en: 'Vaetchanan', he: 'וָאֶתְחַנַּן'});
  expect(readingHe.summary).toBe('דְּבָרִים ג:כג-ז:יא');
  expect(readingHe.fullkriyah['1'].k).toBe('דְּבָרִים');
  expect(readingHe.fullkriyah['1'].k).toBe('דְּבָרִים');
  expect(readingHe.fullkriyah['1'].b).toBe('ג:כג');
  expect(readingHe.fullkriyah['1'].e).toBe('ד:ד');
  expect(readingHe.fullkriyah['1'].v).toBe(11);
  expect(readingHe.fullkriyah['M'].k).toBe('דְּבָרִים');
  expect(readingHe.fullkriyah['M'].b).toBe('ז:ט');
  expect(readingHe.fullkriyah['M'].e).toBe('ז:יא');
  expect(readingHe.fullkriyah['M'].v).toBe(3);
  expect(readingHe.haft.k).toBe('יְשַׁעְיָהוּ');
  expect(readingHe.haft.b).toBe('מ:א');
  expect(readingHe.haft.e).toBe('מ:כו');
  expect(readingHe.haft.v).toBe(26);
  expect(readingHe.haftara).toBe('יְשַׁעְיָהוּ מ:א-כו');
});

test('getLeyningOnDate-holiday1', () => {
  const hd = new HDate(2, 'Tishrei', 5783);
  const reading = getLeyningOnDate(hd, false);
  const expected = {
    name: {en: 'Rosh Hashana II', he: 'רֹאשׁ הַשָּׁנָה יוֹם ב׳'},
    type: 'holiday',
    fullkriyah: {
      '1': {p: 4, k: 'Genesis', b: '22:1', e: '22:3', v: 3},
      '2': {p: 4, k: 'Genesis', b: '22:4', e: '22:8', v: 5},
      '3': {p: 4, k: 'Genesis', b: '22:9', e: '22:14', v: 6},
      '4': {p: 4, k: 'Genesis', b: '22:15', e: '22:19', v: 5},
      '5': {p: 4, k: 'Genesis', b: '22:20', e: '22:24', v: 5},
      'M': {p: 41, k: 'Numbers', b: '29:1', e: '29:6', v: 6},
    },
    summary: 'Genesis 22:1-24; Numbers 29:1-6',
    summaryParts: [
      {k: 'Genesis', b: '22:1', e: '22:24'},
      {k: 'Numbers', b: '29:1', e: '29:6'},
    ],
    haft: {k: 'Jeremiah', b: '31:2', e: '31:20', v: 19,
      "note": "labeled 31:1–19 in some books",
    },
    haftara: 'Jeremiah 31:2-20',
    haftaraNumV: 19,
  };
  expect(reading).toEqual(expected);

  const readingHe = getLeyningOnDate(hd, false, false, 'he');
  expect(readingHe.name).toEqual({en: 'Rosh Hashana II', he: 'רֹאשׁ הַשָּׁנָה יוֹם ב׳'});
  expect(readingHe.summary).toBe('בְּרֵאשִׁית כב:א-כד; בְּמִדְבַּר כט:א-ו');
  expect(readingHe.fullkriyah['1'].k).toBe('בְּרֵאשִׁית');
  expect(readingHe.fullkriyah['M'].k).toBe('בְּמִדְבַּר');
  expect(readingHe.fullkriyah['1'].k).toBe('בְּרֵאשִׁית');
  expect(readingHe.fullkriyah['1'].b).toBe('כב:א');
  expect(readingHe.fullkriyah['1'].e).toBe('כב:ג');
  expect(readingHe.fullkriyah['1'].v).toBe(3);
  expect(readingHe.fullkriyah['5'].k).toBe('בְּרֵאשִׁית');
  expect(readingHe.fullkriyah['5'].b).toBe('כב:כ');
  expect(readingHe.fullkriyah['5'].e).toBe('כב:כד');
  expect(readingHe.fullkriyah['5'].v).toBe(5);
  expect(readingHe.fullkriyah['M'].k).toBe('בְּמִדְבַּר');
  expect(readingHe.fullkriyah['M'].b).toBe('כט:א');
  expect(readingHe.fullkriyah['M'].e).toBe('כט:ו');
  expect(readingHe.fullkriyah['M'].v).toBe(6);
  expect(readingHe.summaryParts[0].k).toBe('בְּרֵאשִׁית');
  expect(readingHe.summaryParts[0].b).toBe('כב:א');
  expect(readingHe.summaryParts[0].e).toBe('כב:כד');
  expect(readingHe.summaryParts[1].k).toBe('בְּמִדְבַּר');
  expect(readingHe.summaryParts[1].b).toBe('כט:א');
  expect(readingHe.summaryParts[1].e).toBe('כט:ו');
  expect(readingHe.haft.k).toBe('יִרְמְיָהוּ');
  expect(readingHe.haftara).toBe('יִרְמְיָהוּ לא:ב-כ');
});

test('getLeyningOnDate-holiday2', () => {
  const hd = new HDate(30, 'Tishrei', 5783);
  const reading = getLeyningOnDate(hd, false);
  const expected = {
    name: {en: 'Rosh Chodesh Cheshvan', he: 'רֹאשׁ חוֹדֶשׁ חֶשְׁוָן'},
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
  expect(reading).toEqual(expected);

  const readingHe = getLeyningOnDate(hd, false, false, 'he');
  expect(readingHe.name).toEqual({en: 'Rosh Chodesh Cheshvan', he: 'רֹאשׁ חוֹדֶשׁ חֶשְׁוָן'});
  expect(readingHe.summary).toBe('בְּמִדְבַּר כח:א-טו');
  expect(readingHe.summaryParts.length).toBe(1);
  expect(readingHe.summaryParts[0].k).toBe('בְּמִדְבַּר');
  expect(readingHe.summaryParts[0].b).toBe('כח:א');
  expect(readingHe.summaryParts[0].e).toBe('כח:טו');
  expect(readingHe.fullkriyah['1'].k).toBe('בְּמִדְבַּר');
  expect(readingHe.fullkriyah['1'].b).toBe('כח:א');
  expect(readingHe.fullkriyah['1'].e).toBe('כח:ג');
  expect(readingHe.fullkriyah['1'].v).toBe(3);
  expect(readingHe.fullkriyah['2'].k).toBe('בְּמִדְבַּר');
  expect(readingHe.fullkriyah['2'].b).toBe('כח:ג');
  expect(readingHe.fullkriyah['2'].e).toBe('כח:ה');
  expect(readingHe.fullkriyah['2'].v).toBe(3);
  expect(readingHe.fullkriyah['3'].k).toBe('בְּמִדְבַּר');
  expect(readingHe.fullkriyah['3'].b).toBe('כח:ו');
  expect(readingHe.fullkriyah['3'].e).toBe('כח:י');
  expect(readingHe.fullkriyah['3'].v).toBe(5);
  expect(readingHe.fullkriyah['4'].k).toBe('בְּמִדְבַּר');
  expect(readingHe.fullkriyah['4'].b).toBe('כח:יא');
  expect(readingHe.fullkriyah['4'].e).toBe('כח:טו');
  expect(readingHe.fullkriyah['4'].v).toBe(5);
  expect(readingHe.fullkriyah['5']).toBeUndefined();
  expect(readingHe.fullkriyah['M']).toBeUndefined();
});

test('getLeyningOnDate-weekday1', () => {
  const hd = new HDate(18, 'Av', 5782);
  const reading = getLeyningOnDate(hd, false);
  const expected = {
    name: {en: 'Eikev', he: 'עֵקֶב'},
    type: 'weekday',
    parsha: ['Eikev'],
    parshaNum: 46,
    summary: 'Deuteronomy 7:12-8:10',
    weekday: {
      '1': {k: 'Deuteronomy', b: '7:12', e: '7:21', v: 10},
      '2': {k: 'Deuteronomy', b: '7:22', e: '8:3', v: 8},
      '3': {k: 'Deuteronomy', b: '8:4', e: '8:10', v: 7},
    },
  };
  expect(reading).toEqual(expected);

  const readingHe = getLeyningOnDate(hd, false, false, 'he');
  expect(readingHe.name).toEqual({en: 'Eikev', he: 'עֵקֶב'});
  expect(readingHe.summary).toBe('דְּבָרִים ז:יב-ח:י');
  expect(readingHe.type).toBe('weekday');
  for (const key in readingHe.weekday) {
    expect(readingHe.weekday[key].k).toBe('דְּבָרִים');
 }
  expect(readingHe.weekday['1'].b).toBe('ז:יב');
  expect(readingHe.weekday['1'].e).toBe('ז:כא');
  expect(readingHe.weekday['1'].v).toBe(10);
  expect(readingHe.weekday['2'].b).toBe('ז:כב');
  expect(readingHe.weekday['2'].e).toBe('ח:ג');
  expect(readingHe.weekday['2'].v).toBe(8);
  expect(readingHe.weekday['3'].b).toBe('ח:ד');
  expect(readingHe.weekday['3'].e).toBe('ח:י');
  expect(readingHe.weekday['3'].v).toBe(7);

});

test('getLeyningOnDate-weekday2', () => {
  const hd = new HDate(23, 'Adar', 5783);
  const reading = getLeyningOnDate(hd, false);
  const expected = {
    name: {en: 'Vayakhel-Pekudei', he: 'וַיַּקְהֵל־פְקוּדֵי'},
    type: 'weekday',
    parsha: ['Vayakhel', 'Pekudei'],
    parshaNum: [22, 23],
    summary: 'Exodus 35:1-20',
    weekday: {
      '1': {k: 'Exodus', b: '35:1', e: '35:3', v: 3},
      '2': {k: 'Exodus', b: '35:4', e: '35:10', v: 7},
      '3': {k: 'Exodus', b: '35:11', e: '35:20', v: 10},
    },
  };
  expect(reading).toEqual(expected);
  const readingHe = getLeyningOnDate(hd, false, false, 'he');
  expect(readingHe.name).toEqual({en: 'Vayakhel-Pekudei', he: 'וַיַּקְהֵל־פְקוּדֵי'});
  expect(readingHe.summary).toBe('שְׁמוֹת לה:א-כ');
  expect(readingHe.summaryParts).toBe(undefined);
  for (const key in readingHe.weekday) {
    expect(readingHe.weekday[key].k).toBe('שְׁמוֹת');
  }
  expect(readingHe.weekday['1'].b).toBe('לה:א');
  expect(readingHe.weekday['1'].e).toBe('לה:ג');
  expect(readingHe.weekday['1'].v).toBe(3);
  expect(readingHe.weekday['2'].b).toBe('לה:ד');
  expect(readingHe.weekday['2'].e).toBe('לה:י');
  expect(readingHe.weekday['2'].v).toBe(7);
  expect(readingHe.weekday['3'].b).toBe('לה:יא');
  expect(readingHe.weekday['3'].e).toBe('לה:כ');
  expect(readingHe.weekday['3'].v).toBe(10);
});

test('getLeyningOnDate-weekday-search1', () => {
  const hd = new HDate(28, 'Elul', 5783);
  const reading = getLeyningOnDate(hd, false);
  const expected = {
    name: {en: 'Ha\'azinu', he: 'הַאֲזִינוּ'},
    type: 'weekday',
    parsha: ['Ha\'azinu'],
    parshaNum: 53,
    summary: 'Deuteronomy 32:1-12',
    weekday: {
      '1': {k: 'Deuteronomy', b: '32:1', e: '32:3', v: 3},
      '2': {k: 'Deuteronomy', b: '32:4', e: '32:6', v: 3},
      '3': {k: 'Deuteronomy', b: '32:7', e: '32:12', v: 6},
    },
  };
  expect(reading).toEqual(expected);
  const readingHe = getLeyningOnDate(hd, false, false, 'he');
  expect(readingHe.name).toEqual({en: 'Ha\'azinu', he: 'הַאֲזִינוּ'});
  expect(readingHe.summary).toBe('דְּבָרִים לב:א-יב');
  expect(readingHe.type).toBe('weekday');
  for (const key in readingHe.weekday) {
    expect(readingHe.weekday[key].k).toBe('דְּבָרִים');
  }
  expect(readingHe.weekday['1'].b).toBe('לב:א');
  expect(readingHe.weekday['1'].e).toBe('לב:ג');
  expect(readingHe.weekday['1'].v).toBe(3);
  expect(readingHe.weekday['2'].b).toBe('לב:ד');
  expect(readingHe.weekday['2'].e).toBe('לב:ו');
  expect(readingHe.weekday['2'].v).toBe(3);
  expect(readingHe.weekday['3'].b).toBe('לב:ז');
  expect(readingHe.weekday['3'].e).toBe('לב:יב');
  expect(readingHe.weekday['3'].v).toBe(6);
});

test('getLeyningOnDate-weekday-erev-sukkot', () => {
  const hd = new HDate(14, 'Tishrei', 5786);
  const reading = getLeyningOnDate(hd, false);
  expect(reading.name.en).toBe('Vezot Haberakhah');
});

test('getLeyningOnDate-weekday-search2', () => {
  const hd = new HDate(24, 'Tishrei', 5787);
  const reading = getLeyningOnDate(hd, true);
  const expected = {
    name: {en: 'Bereshit', he: 'בְּרֵאשִׁית'},
    type: 'weekday',
    parsha: ['Bereshit'],
    parshaNum: 1,
    summary: 'Genesis 1:1-13',
    weekday: {
      '1': {k: 'Genesis', b: '1:1', e: '1:5', v: 5},
      '2': {k: 'Genesis', b: '1:6', e: '1:8', v: 3},
      '3': {k: 'Genesis', b: '1:9', e: '1:13', v: 5},
    },
  };
  expect(reading).toEqual(expected);
  const readingHe = getLeyningOnDate(hd, true, false, 'he');
  expect(readingHe.name).toEqual({en: 'Bereshit', he: 'בְּרֵאשִׁית'});
  expect(readingHe.summary).toBe('בְּרֵאשִׁית א:א-יג');
  expect(readingHe.type).toBe('weekday');
  for (const key in readingHe.weekday) {
    expect(readingHe.weekday[key].k).toBe('בְּרֵאשִׁית');
  }
  expect(readingHe.weekday['1'].b).toBe('א:א');
  expect(readingHe.weekday['1'].e).toBe('א:ה');
  expect(readingHe.weekday['1'].v).toBe(5);
  expect(readingHe.weekday['2'].b).toBe('א:ו');
  expect(readingHe.weekday['2'].e).toBe('א:ח');
  expect(readingHe.weekday['2'].v).toBe(3);
  expect(readingHe.weekday['3'].b).toBe('א:ט');
  expect(readingHe.weekday['3'].e).toBe('א:יג');
  expect(readingHe.weekday['3'].v).toBe(5);
});

test('getLeyningOnDate-weekday-undefined', () => {
  const hd = new HDate(12, 'Tishrei', 5787);
  const reading = getLeyningOnDate(hd, true);
  expect(reading).toBe(undefined);
});

test('getLeyningOnDate-15av-Wednesday', () => {
  const hd = new HDate(15, 'Av', 5786);
  const reading = getLeyningOnDate(hd, false);
  expect(reading).toBe(undefined);
});

test('getLeyningOnDate-15av-Monday', () => {
  const hd = new HDate(15, 'Av', 5788);
  // Tu B'Av doesn't generate reading
  const reading = getLeyningOnDate(hd, false);
  const expected = {
    name: {en: 'Eikev', he: 'עֵקֶב'},
    type: 'weekday',
    parsha: ['Eikev'],
    parshaNum: 46,
    summary: 'Deuteronomy 7:12-8:10',
    weekday: {
      '1': {k: 'Deuteronomy', b: '7:12', e: '7:21', v: 10},
      '2': {k: 'Deuteronomy', b: '7:22', e: '8:3', v: 8},
      '3': {k: 'Deuteronomy', b: '8:4', e: '8:10', v: 7},
    },
  };
  expect(reading).toEqual(expected);
});

test('getLeyningOnDate-multiple-holidays', () => {
  // Shabbat Zachor, Erev Purim, Parashat Vayikra
  const hd = new HDate(new Date(2024, 2, 23));
  const readings = getLeyningOnDate(hd, false, true);
  expect(readings.length).toBe(2);
  expect(readings[0].name.en).toBe('Vayikra');
  expect(readings[0].summary).toBe('Leviticus 1:1-5:26; Deuteronomy 25:17-19');
  expect(readings[0].reason.M).toBe('Shabbat Zachor');
  expect(readings[1].name.en).toBe('Erev Purim');

  const readingsHe = getLeyningOnDate(hd, false, true, 'he');
  expect(readingsHe.length).toBe(2);
  expect(readingsHe[0].name.he).toBe('וַיִּקְרָא');
  expect(readingsHe[0].summary).toBe('וַיִּקְרָא א:א-ה:כו; דְּבָרִים כה:יז-יט');
  expect(readingsHe[1].name.he).toBe('עֶרֶב פּוּרִים');

  // Ignore Rosh Hashana LaBehemot and continue to Rosh Chodesh
  const hd2 = new HDate(1, 'Elul', 5784);
  const reading2 = getLeyningOnDate(hd2, false);
  expect(reading2.name.en).toBe('Rosh Chodesh Elul');

  const reading2He = getLeyningOnDate(hd2, false, false, 'he');
  expect(reading2He.name.he).toBe('רֹאשׁ חוֹדֶשׁ אֱלוּל');
});

test('getLeyningOnDate-Erev-Purim', () => {
  const hd = new HDate(13, 'Adar', 5783);
  const readings = getLeyningOnDate(hd, false, true);
  expect(readings.length).toBe(3);
  expect(readings[0].name.en).toBe('Ta\'anit Esther');
  expect(readings[1].name.en).toBe('Ta\'anit Esther (Mincha)');
  expect(readings[2].name.en).toBe('Erev Purim');
  const readingsHe = getLeyningOnDate(hd, false, true, 'he');
  expect(readingsHe.length).toBe(3);
  expect(readingsHe[0].name.he).toBe('תַּעֲנִית אֶסְתֵּר');
  expect(readingsHe[1].name.he).toBe('תַּעֲנִית אֶסְתֵּר (מִנְחָה)');
  expect(readingsHe[2].name.he).toBe('עֶרֶב פּוּרִים');
});

test('getLeyningOnDate-Shabbat-Rosh-Chodesh', () => {
  const hd = new HDate(1, months.CHESHVAN, 5785);
  const readings = getLeyningOnDate(hd, false, true);
  expect(readings.length).toBe(1);
  expect(readings[0].name.en).toBe('Noach');
  expect(readings[0].reason).toEqual({
    "M": "Shabbat Rosh Chodesh",
    "haftara": "Shabbat Rosh Chodesh",
  });
  expect(readings[0].summary).toBe('Genesis 6:9-11:32; Numbers 28:9-15');
  const readingsHe = getLeyningOnDate(hd, false, true, 'he');
  expect(readingsHe.length).toBe(1);
  expect(readingsHe[0].name.he).toBe('נֹחַ');
  expect(readingsHe[0].summary).toBe('בְּרֵאשִׁית ו:ט-יא:לב; בְּמִדְבַּר כח:ט-טו');
  expect(readingsHe[0].reason).toEqual({
    "M": "שַׁבָּת רֹאשׁ חוֹדֶשׁ",
    "haftara": "שַׁבָּת רֹאשׁ חוֹדֶשׁ",
  });
});

test('getLeyningOnDate-Shabbat-Chanukah', () => {
  const hd = new HDate(27, months.KISLEV, 5785);
  const readings = getLeyningOnDate(hd, false, true);
  expect(readings.length).toBe(1);
  expect(readings[0].name.en).toBe('Miketz');
  expect(readings[0].summary).toBe('Genesis 41:1-44:17; Numbers 7:24-29');
  expect(readings[0].reason).toEqual({
    "M": "Chanukah Day 3 (on Shabbat)",
    "haftara": "Chanukah Day 3 (on Shabbat)",
  });
  const readingsHe = getLeyningOnDate(hd, false, true, 'he');
  expect(readingsHe.length).toBe(1);
  expect(readingsHe[0].name.he).toBe('מִקֵּץ');
  expect(readingsHe[0].summary).toBe('בְּרֵאשִׁית מא:א-מד:יז; בְּמִדְבַּר ז:כד-כט');
  expect(readingsHe[0].reason).toEqual({
    "M": "חֲנוּכָּה יוֹם ג׳ (בְּשַׁבָּת)",
    "haftara": "חֲנוּכָּה יוֹם ג׳ (בְּשַׁבָּת)",
  });
});

test('getLeyningOnDate-Rosh-Chodesh-Chanukah', () => {
  const hd = new HDate(30, months.KISLEV, 5787);
  const readings = getLeyningOnDate(hd, false, true);
  expect(readings.length).toBe(1);
  expect(readings[0].name.en).toBe('Chanukah Day 6');
  expect(readings[0].summary).toEqual("Numbers 28:1-15, 7:42-47")
  expect(readings[0].reason).toBeUndefined();
  const readingsHe = getLeyningOnDate(hd, false, true, 'he');
  expect(readingsHe.length).toBe(1);
  expect(readingsHe[0].name.he).toBe('חֲנוּכָּה יוֹם ו׳');
  expect(readingsHe[0].summary).toBe('בְּמִדְבַּר כח:א-טו, ז:מב-מז');
  expect(readingsHe[0].reason).toBe(undefined);
});

test('getLeyningOnDate-Shabbat-Rosh-Chodesh-Chanukah', () => {
  const hd = new HDate(30, months.KISLEV, 5782);
  const readings = getLeyningOnDate(hd, false, true);
  expect(readings.length).toBe(1);
  expect(readings[0].name.en).toBe('Miketz');
  expect(readings[0].reason).toEqual({
    "7": "Shabbat Rosh Chodesh Chanukah",
    "M": "Shabbat Rosh Chodesh Chanukah",
    "haftara": "Shabbat Rosh Chodesh Chanukah",
  });
  const readingsHe = getLeyningOnDate(hd, false, true, 'he');

  expect(readingsHe.length).toBe(1);
  expect(readingsHe[0].name.he).toBe('מִקֵּץ');
  expect(readingsHe[0].reason).toEqual({
    "7": "שַׁבָּת רֹאשׁ חוֹדֶשׁ חֲנוּכָּה",
    "M": "שַׁבָּת רֹאשׁ חוֹדֶשׁ חֲנוּכָּה",
    "haftara": "שַׁבָּת רֹאשׁ חוֹדֶשׁ חֲנוּכָּה",
  });
});

test('getLeyningOnDate-Shabbat-Rosh-Chodesh-Shekalim', () => {
  const hd = new HDate(1, months.ADAR_I, 5785);
  const readings = getLeyningOnDate(hd, false, true);
  expect(readings.length).toBe(1);
  expect(readings[0].name.en).toBe('Terumah');
  expect(readings[0].reason).toEqual({
    "7": "Shabbat Shekalim (on Rosh Chodesh)",
    "M": "Shabbat Shekalim (on Rosh Chodesh)",
    "haftara": "Shabbat Shekalim (on Rosh Chodesh)",
    "sephardic": "Shabbat Shekalim (on Rosh Chodesh)",
  });
  expect(readings[0].fullkriyah[2]).toEqual({
    "b": "25:17",
    "e": "25:40",
    "k": "Exodus",
    "v": 24,
    "reason": "some sources use 25:17-30",
  });
  const readingsHe = getLeyningOnDate(hd, false, true, 'he');
  expect(readingsHe.length).toBe(1);
  expect(readingsHe[0].name.he).toBe('תְּרוּמָה');
  expect(readingsHe[0].reason).toEqual({
    "7": "שַׁבָּת שְׁקָלִים (רֹאשׁ חוֹדֶשׁ)",
    "M": "שַׁבָּת שְׁקָלִים (רֹאשׁ חוֹדֶשׁ)",
    "haftara": "שַׁבָּת שְׁקָלִים (רֹאשׁ חוֹדֶשׁ)",
    "sephardic": "שַׁבָּת שְׁקָלִים (רֹאשׁ חוֹדֶשׁ)",
  });
  expect(readingsHe[0].fullkriyah[2]).toEqual({
    "k": "שְׁמוֹת",
    "b": "כה:יז",
    "e": "כה:מ",
    "v": 24,
    "reason": "some sources use 25:17-30",
  });
});

test('getLeyningOnDate-wantarray-empty', () => {
  const hd = new HDate(12, 'Adar', 5783);
  const readings = getLeyningOnDate(hd, false, true);
  expect(readings.length).toBe(0);
  const readingsHe = getLeyningOnDate(hd, false, true, 'he');
  expect(readingsHe.length).toBe(0);
});

test('getLeyningOnDate-no-wantarray', () => {
  const hd = new HDate(12, 'Adar', 5783);
  const readings = getLeyningOnDate(hd, false, false);
  expect(readings).toBeUndefined();
  const readingsHe = getLeyningOnDate(hd, false, false, 'he');
  expect(readingsHe).toBeUndefined();
});

test('getLeyningOnDate-pesach-disaspora', () => {
  const actual = [];
  for (let i = 15; i <= 22; i++) {
    const hd = new HDate(i, 'Nisan', 5784);
    const reading = getLeyningOnDate(hd, false);
    const readingHe = getLeyningOnDate(hd, false, false, 'he');
    actual.push({
      d: hd.greg().toLocaleDateString('en-CA').substring(0, 10),
      n: reading.name.en,
      s: reading.summary,
      ns: readingHe?.summary,
    });
  }
  const expected = [
    {
      d: '2024-04-23',
      n: 'Pesach I',
      s: 'Exodus 12:21-51; Numbers 28:16-25',
      ns: "שְׁמוֹת יב:כא-נא; בְּמִדְבַּר כח:טז-כה",
    },
    {
      d: '2024-04-24',
      n: 'Pesach II',
      s: 'Leviticus 22:26-23:44; Numbers 28:16-25',
      ns: "וַיִּקְרָא כב:כו-כג:מד; בְּמִדְבַּר כח:טז-כה",
    },
    {
      d: '2024-04-25',
      n: 'Pesach Chol ha-Moed Day 1',
      s: 'Exodus 13:1-16; Numbers 28:19-25',
      ns: "שְׁמוֹת יג:א-טז; בְּמִדְבַּר כח:יט-כה",
    },
    {
      d: '2024-04-26',
      n: 'Pesach Chol ha-Moed Day 2',
      s: 'Exodus 22:24-23:19; Numbers 28:19-25',
      ns: "שְׁמוֹת כב:כד-כג:יט; בְּמִדְבַּר כח:יט-כה",
    },
    {
      d: '2024-04-27',
      n: 'Pesach Shabbat Chol ha-Moed',
      s: 'Exodus 33:12-34:26; Numbers 28:19-25; Song of Songs 1:1-8:14',
      ns: "שְׁמוֹת לג:יב-לד:כו; בְּמִדְבַּר כח:יט-כה; שִׁיר הַשִּׁירִים א:א-ח:יד",
    },
    {
      d: '2024-04-28',
      n: 'Pesach Chol ha-Moed Day 4',
      s: 'Numbers 9:1-14, 28:19-25',
      ns: "בְּמִדְבַּר ט:א-יד, כח:יט-כה",
    },
    {
      d: '2024-04-29',
      n: 'Pesach VII',
      s: 'Exodus 13:17-15:26; Numbers 28:19-25',
      ns: "שְׁמוֹת יג:יז-טו:כו; בְּמִדְבַּר כח:יט-כה",
    },
    {
      d: '2024-04-30',
      n: 'Pesach VIII',
      s: 'Deuteronomy 15:19-16:17; Numbers 28:19-25',
      ns: "דְּבָרִים טו:יט-טז:יז; בְּמִדְבַּר כח:יט-כה",
    },
  ];
  expect(actual).toEqual(expected);
});

test('getLeyningOnDate-weekday-erev9av', () => {
  const hd = new HDate(8, 'Av', 5784);
  const readings = getLeyningOnDate(hd, false, true, "he");
  expect(readings.length).toBe(2);
  expect(readings[0].name.en).toBe('Vaetchanan');
  expect(readings[0].name.he).toBe('וָאֶתְחַנַּן');
  expect(readings[1].name.en).toBe('Erev Tish\'a B\'Av');
  expect(readings[1].name.he).toBe('עֶרֶב תִּשְׁעָה בְּאָב');
});

test('getLeyningOnDate-erev9av-sat-nite', () => {
  const hd = new HDate(8, 'Av', 5785);
  const readings = getLeyningOnDate(hd, false, true);
  expect(readings.length).toBe(2);
  expect(readings[0].name.en).toBe('Devarim');
  expect(readings[1].name.en).toBe('Erev Tish\'a B\'Av');
});

test('erev-purim-wed-nite', () => {
  const hd = new HDate(13, 'Adar 2', 5782);
  const readings = getLeyningOnDate(hd, false, true);
  expect(readings.length).toBe(3);
  expect(readings[0].name.en).toBe('Ta\'anit Esther');
  expect(readings[1].name.en).toBe('Ta\'anit Esther (Mincha)');
  expect(readings[2].name.en).toBe('Erev Purim');
});

test('erev-purim-sat-nite', () => {
  const hd = new HDate(13, 'Adar', 5784);
  const readings = getLeyningOnDate(hd, false, true);
  expect(readings.length).toBe(2);
  expect(readings[0].name.en).toBe('Vayikra');
  expect(readings[1].name.en).toBe('Erev Purim');
});

test('Erev Simchat Torah Diaspora', () => {
  const hd = new HDate(22, 'Tishrei', 5783);
  const readings = getLeyningOnDate(hd, false, true);
  expect(readings.length).toBe(2);
  expect(readings[1].name.en).toBe('Erev Simchat Torah');
});

test('Erev Simchat Torah Israel', () => {
  const hd = new HDate(21, 'Tishrei', 5783);
  const readings = getLeyningOnDate(hd, true, true);
  expect(readings.length).toBe(2);
  expect(readings[1].name.en).toBe('Erev Simchat Torah');
});

test('getLeyningOnDate-weekday-search3', () => {
  const hd = new HDate(5, 'Tishrei', 5785);
  expect(hd.getDay()).toBe(1); // this is a Monday
  const reading = getLeyningOnDate(hd, false);
  expect(reading.name.en).toBe('Vezot Haberakhah');
});

test('getLeyningOnDate-weekday-search4', () => {
  const hd = new HDate(6, 'Tishrei', 5787);
  expect(hd.getDay()).toBe(4); // this is a Thursday
  const reading = getLeyningOnDate(hd, false);
  expect(reading.name.en).toBe('Ha\'azinu');
});

test('no duplicates on Shabbat Rosh Chodesh Chanukah', () => {
  const hd = new HDate(30, 'Kislev', 5782);
  const result = getLeyningOnDate(hd, false, true);
  expect(result.length).toBe(1);
});

test('Yom Kippur Mincha on Shabbat', () => {
  const hd = new HDate(10, 'Tishrei', 5785);
  const readings = getLeyningOnDate(hd, false, true);
  expect(readings.length).toBe(2);
  expect(readings[0].name.en).toBe('Yom Kippur (on Shabbat)');
  expect(readings[1].name.en).toBe('Yom Kippur (Mincha)');

  const readingsHe = getLeyningOnDate(hd, false, true, 'he');
  expect(readingsHe.length).toBe(2);
  expect(readingsHe[0].name.he).toBe('יוֹם כִּפּוּר (בְּשַׁבָּת)');
  expect(readingsHe[1].name.he).toBe('יוֹם כִּפּוּר (מִנְחָה)');
  expect(readingsHe[0].fullkriyah['1'].k).toBe('וַיִּקְרָא');
  expect(readingsHe[1].fullkriyah['1'].k).toBe('וַיִּקְרָא');
});
