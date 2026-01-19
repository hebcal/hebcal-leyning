import {expect, test, describe} from 'vitest';
import {
  addVerses,
  calculateNumVerses,
  formatAliyahShort,
  formatVerseToHebrew,
  parshaToString,
  subtractVerses,
  makeLeyningSummary,
  makeLeyningParts,
} from '../src/common';

test('calculateNumVerses', () => {
  expect(calculateNumVerses({k: 'Genesis', b: '1:1', e: '1:1'})).toBe(1);
  expect(calculateNumVerses({k: 'Genesis', b: '1:1', e: '1:2'})).toBe(2);
  expect(calculateNumVerses({k: 'Genesis', b: '1:1', e: '2:3'})).toBe(34);
  expect(calculateNumVerses({k: 'Genesis', b: '2:4', e: '2:19'})).toBe(16);
  expect(calculateNumVerses({k: 'Genesis', b: '2:20', e: '3:21'})).toBe(27);
  expect(calculateNumVerses({k: 'Genesis', b: '3:22', e: '4:18'})).toBe(21);
  expect(calculateNumVerses({k: 'Genesis', b: '1:1', e: '3:21'})).toBe(77);
  expect(calculateNumVerses({k: 'II Kings', b: '12:1', e: '12:17'})).toBe(17);
  expect(calculateNumVerses({k: 'Ezekiel', b: '45:16', e: '46:18'})).toBe(28);
  expect(calculateNumVerses({k: 'Isaiah', b: '54:11', e: '55:5'})).toBe(12);
  expect(calculateNumVerses({k: 'Zechariah', b: '2:14', e: '4:7'})).toBe(21);
  expect(calculateNumVerses({k: 'Ezekiel', b: '1:1', e: '1:28'})).toBe(28);
  expect(calculateNumVerses({k: 'Deuteronomy', b: '5:25', e: '6:3'})).toBe(9);
});

test('subtractVerses', () => {
  expect(subtractVerses('Genesis', '1:1', '1:1')).toBe(0);
  expect(subtractVerses('Genesis', '1:1', '1:2')).toBe(1);
  expect(subtractVerses('Genesis', '1:1', '2:3')).toBe(33);
  expect(subtractVerses('Genesis', '2:4', '2:19')).toBe(15);
  expect(subtractVerses('Genesis', '2:20', '3:21')).toBe(26);
  expect(subtractVerses('Genesis', '3:22', '4:18')).toBe(20);
  expect(subtractVerses('Genesis', '1:1', '3:21')).toBe(76);
  expect(subtractVerses('II Kings', '12:1', '12:17')).toBe(16);
  expect(subtractVerses('Ezekiel', '45:16', '46:18')).toBe(27);
  expect(subtractVerses('Isaiah', '54:11', '55:5')).toBe(11);
  expect(subtractVerses('Zechariah', '2:14', '4:7')).toBe(20);
  expect(subtractVerses('Ezekiel', '1:1', '1:28')).toBe(27);
  expect(subtractVerses('Deuteronomy', '5:25', '6:3')).toBe(8);
});

test('addVerses', () => {
  expect(addVerses('Genesis', '1:1', 0)).toBe('1:1');
  expect(addVerses('Genesis', '1:1', 1)).toBe('1:2');
  expect(addVerses('Genesis', '1:1', 33)).toBe('2:3');
  expect(addVerses('Genesis', '2:4', 15)).toBe('2:19');
  expect(addVerses('Genesis', '2:20', 26)).toBe('3:21');
  expect(addVerses('Genesis', '3:22', 20)).toBe('4:18');
  expect(addVerses('Genesis', '1:1', 76)).toBe('3:21');
  expect(addVerses('II Kings', '12:1', 16)).toBe('12:17');
  expect(addVerses('Ezekiel', '45:16', 27)).toBe('46:18');
  expect(addVerses('Isaiah', '54:11', 11)).toBe('55:5');
  expect(addVerses('Zechariah', '2:14', 20)).toBe('4:7');
  expect(addVerses('Ezekiel', '1:1', 27)).toBe('1:28');
  expect(addVerses('Deuteronomy', '5:25', 8)).toBe('6:3');

  expect(addVerses('Deuteronomy', '5:25', 999)).toBeNull();
  expect(addVerses('Genesis', '50:25', 1)).toBe('50:26');
  expect(addVerses('Genesis', '50:25', 2)).toBeNull();
  expect(addVerses('Genesis', '1:30', 1)).toBe('1:31');
  expect(addVerses('Exodus', '20:23', 1)).toBe('21:1');
});

test('add and subtract', () => {
  const book = 'Genesis';
  const start = '1:1';
  for (let i = 0; i < 100; i++) {
    const end = addVerses(book, start, i);
    const diff = subtractVerses(book, start, end);
    expect(diff).toBe(i);
  }
});

test('parshaToString', () => {
  expect(parshaToString('Bereshit')).toBe('Bereshit');
  expect(parshaToString(['Bereshit'])).toBe('Bereshit');
  expect(parshaToString(['Matot', 'Masei'])).toBe('Matot-Masei');
  expect(parshaToString('Matot-Masei')).toBe('Matot-Masei');
});

test('parshaToString-throws', () => {
  expect(() => {
    parshaToString([]);
  }).toThrow('Bad parsha argument: ');
  expect(() => {
    parshaToString(123);
  }).toThrow('Bad parsha argument: 123');
  expect(() => {
    parshaToString(null);
  }).toThrow('Bad parsha argument: null');
});

describe('formatVerseToHebrew', () => {
  test('single digit chapter and verse', () => {
    expect(formatVerseToHebrew('1:1')).toBe('א:א');
    expect(formatVerseToHebrew('2:3')).toBe('ב:ג');
    expect(formatVerseToHebrew('5:7')).toBe('ה:ז');
    expect(formatVerseToHebrew('9:9')).toBe('ט:ט');
  });

  test('double digit chapter, single digit verse', () => {
    expect(formatVerseToHebrew('10:1')).toBe('י:א');
    expect(formatVerseToHebrew('20:5')).toBe('כ:ה');
    expect(formatVerseToHebrew('28:9')).toBe('כח:ט');
    expect(formatVerseToHebrew('30:1')).toBe('ל:א');
  });

  test('single digit chapter, double digit verse', () => {
    expect(formatVerseToHebrew('1:10')).toBe('א:י');
    expect(formatVerseToHebrew('3:20')).toBe('ג:כ');
    expect(formatVerseToHebrew('5:25')).toBe('ה:כה');
  });

  test('double digit chapter and verse', () => {
    expect(formatVerseToHebrew('12:21')).toBe('יב:כא');
    expect(formatVerseToHebrew('28:15')).toBe('כח:טו');
    expect(formatVerseToHebrew('22:22')).toBe('כב:כב');
    expect(formatVerseToHebrew('50:26')).toBe('נ:כו');
  });

  test('special case for 15 (avoiding God\'s name)', () => {
    expect(formatVerseToHebrew('15:1')).toBe('טו:א');
    expect(formatVerseToHebrew('1:15')).toBe('א:טו');
    expect(formatVerseToHebrew('15:15')).toBe('טו:טו');
  });

  test('special case for 16 (avoiding God\'s name)', () => {
    expect(formatVerseToHebrew('16:1')).toBe('טז:א');
    expect(formatVerseToHebrew('1:16')).toBe('א:טז');
    expect(formatVerseToHebrew('16:16')).toBe('טז:טז');
  });

  test('chapters with 15 or 16 in tens place', () => {
    expect(formatVerseToHebrew('25:1')).toBe('כה:א');
    expect(formatVerseToHebrew('35:10')).toBe('לה:י');
    expect(formatVerseToHebrew('45:20')).toBe('מה:כ');
  });

  test('larger chapter numbers (50-99)', () => {
    expect(formatVerseToHebrew('54:1')).toBe('נד:א');
    expect(formatVerseToHebrew('55:5')).toBe('נה:ה');
    expect(formatVerseToHebrew('70:1')).toBe('ע:א');
    expect(formatVerseToHebrew('80:5')).toBe('פ:ה');
    expect(formatVerseToHebrew('90:1')).toBe('צ:א');
  });

  test('real-world Torah examples', () => {
    expect(formatVerseToHebrew('6:3')).toBe('ו:ג');
    expect(formatVerseToHebrew('12:1')).toBe('יב:א');
    expect(formatVerseToHebrew('20:14')).toBe('כ:יד');
    expect(formatVerseToHebrew('33:29')).toBe('לג:כט');
  });

  test('real-world Nevi\'im/Ketuvim examples', () => {
    expect(formatVerseToHebrew('22:51')).toBe('כב:נא');
    expect(formatVerseToHebrew('46:18')).toBe('מו:יח');
    expect(formatVerseToHebrew('4:7')).toBe('ד:ז');
  });
});

describe('formatAliyahShort', () => {
  const testCases = [
    {
      desc: 'with book name, same chapter',
      aliyah: {k: 'Numbers', b: '28:9', e: '28:15'},
      includeBook: true,
      expectedEn: 'Numbers 28:9-15',
      expectedHe: 'בְּמִדְבַּר כח:ט-טו',
    },
    {
      desc: 'without book name, same chapter',
      aliyah: {k: 'Numbers', b: '28:9', e: '28:15'},
      includeBook: false,
      expectedEn: '28:9-15',
      expectedHe: 'כח:ט-טו',
    },
    {
      desc: 'with book name, different chapters',
      aliyah: {k: 'Genesis', b: '1:1', e: '2:3'},
      includeBook: true,
      expectedEn: 'Genesis 1:1-2:3',
      expectedHe: 'בְּרֵאשִׁית א:א-ב:ג',
    },
    {
      desc: 'without book name, different chapters',
      aliyah: {k: 'Genesis', b: '1:1', e: '2:3'},
      includeBook: false,
      expectedEn: '1:1-2:3',
      expectedHe: 'א:א-ב:ג',
    },
    {
      desc: 'with book name, single verse',
      aliyah: {k: 'Exodus', b: '12:21', e: '12:21'},
      includeBook: true,
      expectedEn: 'Exodus 12:21',
      expectedHe: 'שְׁמוֹת יב:כא',
    },
    {
      desc: 'without book name, single verse',
      aliyah: {k: 'Exodus', b: '12:21', e: '12:21'},
      includeBook: false,
      expectedEn: '12:21',
      expectedHe: 'יב:כא',
    },
  ];

  describe('English formatting', () => {
    test.each(testCases)('$desc', ({aliyah, includeBook, expectedEn}) => {
      expect(formatAliyahShort(aliyah, includeBook, 'en')).toBe(expectedEn);
    });

    test('default language is English', () => {
      const aliyah = {k: 'Leviticus', b: '6:1', e: '6:11'};
      expect(formatAliyahShort(aliyah, true)).toBe('Leviticus 6:1-11');
    });

    test('with various Torah books', () => {
      expect(formatAliyahShort({k: 'Deuteronomy', b: '5:1', e: '5:18'}, true, 'en'))
        .toBe('Deuteronomy 5:1-18');
      expect(formatAliyahShort({k: 'Genesis', b: '6:9', e: '6:22'}, true, 'en'))
        .toBe('Genesis 6:9-22');
    });
  });

  describe('Hebrew formatting', () => {
    test.each(testCases)('$desc', ({aliyah, includeBook, expectedHe}) => {
      expect(formatAliyahShort(aliyah, includeBook, 'he')).toBe(expectedHe);
    });

    test('special cases for 15 and 16 (avoiding God\'s name)', () => {
      const aliyah15 = {k: 'Leviticus', b: '15:1', e: '15:15'};
      expect(formatAliyahShort(aliyah15, false, 'he')).toBe('טו:א-טו');

      const aliyah16 = {k: 'Leviticus', b: '16:1', e: '16:16'};
      expect(formatAliyahShort(aliyah16, false, 'he')).toBe('טז:א-טז');
    });

    test('with Nevi\'im books', () => {
      const aliyah = {k: 'Isaiah', b: '54:1', e: '55:5'};
      expect(formatAliyahShort(aliyah, true, 'he')).toBe('יְשַׁעְיָהוּ נד:א-נה:ה');
    });
  });

  describe('Edge cases', () => {
    test('chapter 1, verse 1', () => {
      const aliyah = {k: 'Genesis', b: '1:1', e: '1:1'};
      expect(formatAliyahShort(aliyah, true, 'en')).toBe('Genesis 1:1');
      expect(formatAliyahShort(aliyah, true, 'he')).toBe('בְּרֵאשִׁית א:א');
    });

    test('II Samuel (Roman numerals)', () => {
      const aliyah = {k: 'II Samuel', b: '22:1', e: '22:51'};
      expect(formatAliyahShort(aliyah, true, 'en')).toBe('II Samuel 22:1-51');
      expect(formatAliyahShort(aliyah, true, 'he')).toBe('שְׁמוּאֵל ב כב:א-נא');
    });

    test('Song of Songs (multi-word book)', () => {
      const aliyah = {k: 'Song of Songs', b: '1:1', e: '1:4'};
      expect(formatAliyahShort(aliyah, true, 'en')).toBe('Song of Songs 1:1-4');
      expect(formatAliyahShort(aliyah, true, 'he')).toBe('שִׁיר הַשִּׁירִים א:א-ד');
    });
  });
});


test('mls-Noach', () => {
  const fullkriyah = {
    '1': {k: 'Genesis', b: '6:9', e: '6:22'},
    '2': {k: 'Genesis', b: '7:1', e: '7:16'},
    '3': {k: 'Genesis', b: '7:17', e: '8:14'},
    '4': {k: 'Genesis', b: '8:15', e: '9:7'},
    '5': {k: 'Genesis', b: '9:8', e: '9:17'},
    '6': {k: 'Genesis', b: '9:18', e: '10:32'},
    '7': {k: 'Genesis', b: '11:1', e: '11:32'},
    'M': {k: 'Genesis', b: '11:29', e: '11:32'},
  };
  const summary = makeLeyningSummary(fullkriyah);
  expect(summary).toBe('Genesis 6:9-11:32');
});

test('mls-Vayakhel-Pekudei on Shabbat HaChodesh', () => {
  const fullkriyah = {
    '1': {k: 'Exodus', b: '35:1', e: '35:29', v: 29},
    '2': {k: 'Exodus', b: '35:30', e: '37:16', v: 60},
    '3': {k: 'Exodus', b: '37:17', e: '37:29', v: 13},
    '4': {k: 'Exodus', b: '38:1', e: '39:1', v: 32},
    '5': {k: 'Exodus', b: '39:2', e: '39:21', v: 20},
    '6': {k: 'Exodus', b: '39:22', e: '39:43', v: 22},
    '7': {k: 'Exodus', b: '40:1', e: '40:38', v: 38},
    'M': {p: 15, k: 'Exodus', b: '12:1', e: '12:20', v: 20},
  };
  const summary = makeLeyningSummary(fullkriyah);
  expect(summary).toBe('Exodus 35:1-40:38, 12:1-20');
});

test('mls-Shmini Atzeret (on Shabbat)', () => {
  const fullkriyah = {
    '1': {'p': 47, 'k': 'Deuteronomy', 'b': '14:22', 'e': '14:29'},
    '2': {'p': 47, 'k': 'Deuteronomy', 'b': '15:1', 'e': '15:18'},
    '3': {'p': 47, 'k': 'Deuteronomy', 'b': '15:19', 'e': '15:23'},
    '4': {'p': 47, 'k': 'Deuteronomy', 'b': '16:1', 'e': '16:3'},
    '5': {'p': 47, 'k': 'Deuteronomy', 'b': '16:4', 'e': '16:8'},
    '6': {'p': 47, 'k': 'Deuteronomy', 'b': '16:9', 'e': '16:12'},
    '7': {'p': 47, 'k': 'Deuteronomy', 'b': '16:13', 'e': '16:17'},
    'M': {'p': 41, 'k': 'Numbers', 'b': '29:35', 'e': '30:1'},
  };
  const summary = makeLeyningSummary(fullkriyah);
  expect(summary).toBe('Deuteronomy 14:22-16:17; Numbers 29:35-30:1');
});

test('mls-Chanukah Day 6', () => {
  const fullkriyah = {
    '1': {'p': 41, 'k': 'Numbers', 'b': '28:1', 'e': '28:5'},
    '2': {'p': 41, 'k': 'Numbers', 'b': '28:6', 'e': '28:10'},
    '3': {'p': 41, 'k': 'Numbers', 'b': '28:11', 'e': '28:15'},
    'M': {'p': 35, 'k': 'Numbers', 'b': '7:42', 'e': '7:47'},
  };
  const summary = makeLeyningSummary(fullkriyah);
  expect(summary).toBe('Numbers 28:1-15, 7:42-47');
});

test('mls-Shabbat Shekalim', () => {
  const fullkriyah = {
    'M': {'p': 21, 'k': 'Exodus', 'b': '30:11', 'e': '30:16'},
  };
  const summary = makeLeyningSummary(fullkriyah);
  expect(summary).toBe('Exodus 30:11-16');
});

test('mls-Tzom Gedaliah', () => {
  const fullkriyah = {
    '1': {'p': 21, 'k': 'Exodus', 'b': '32:11', 'e': '32:14'},
    '2': {'p': 21, 'k': 'Exodus', 'b': '34:1', 'e': '34:3'},
    '3': {'p': 21, 'k': 'Exodus', 'b': '34:4', 'e': '34:10'},
  };
  const summary = makeLeyningSummary(fullkriyah);
  expect(summary).toBe('Exodus 32:11-14, 34:1-10');
});

test('makeLeyningParts-megillah', () => {
  const aliyot = {
    '1': {
      'k': 'Esther',
      'b': '1:1',
      'e': '1:22',
      'v': 22,
    },
    '2': {
      'k': 'Esther',
      'b': '2:1',
      'e': '2:23',
      'v': 23,
    },
    '3': {
      'k': 'Esther',
      'b': '3:1',
      'e': '3:15',
      'v': 15,
    },
    '4': {
      'k': 'Esther',
      'b': '4:1',
      'e': '4:17',
      'v': 17,
    },
    '5': {
      'k': 'Esther',
      'b': '5:1',
      'e': '5:14',
      'v': 14,
    },
    '6': {
      'k': 'Esther',
      'b': '6:1',
      'e': '6:14',
      'v': 14,
    },
    '7': {
      'k': 'Esther',
      'b': '7:1',
      'e': '7:10',
      'v': 10,
    },
    '8': {
      'k': 'Esther',
      'b': '8:1',
      'e': '8:17',
      'v': 17,
    },
    '9': {
      'k': 'Esther',
      'b': '9:1',
      'e': '9:32',
      'v': 32,
    },
    '10': {
      'k': 'Esther',
      'b': '10:1',
      'e': '10:3',
      'v': 3,
    },
  };
  const parts = makeLeyningParts(aliyot);
  const expected = [{b: '1:1', e: '10:3', k: 'Esther'}];
  expect(parts).toEqual(expected);
});
