import {expect, test} from 'vitest';
import {getLeyningForParsha, lookupParsha} from '../src/leyning';
import {getLeyningForHolidayKey} from '../src/getLeyningForHoliday';

test('parsha-alt-chabad-Terumah', () => {
  const reading = getLeyningForParsha('Terumah');
  // default (Koren) division is unchanged
  expect(reading.fullkriyah['2']).toEqual({k: 'Exodus', b: '25:17', e: '25:40', v: 24});
  expect(reading.fullkriyah['3']).toEqual({k: 'Exodus', b: '26:1', e: '26:14', v: 14});
  expect(reading.fullkriyahSrc).toEqual([
    {title: 'Koren'},
    {title: 'Etz Hayyim'},
    {title: 'USCJ Luach'},
  ]);
  // Chabad alternate division lists only the aliyot that differ
  expect(reading.alt).toEqual({
    chabad: {
      sources: [
        {title: 'Chabad'},
        {title: 'Torah Temimah'},
        {title: 'Tikkun Yissachar'},
        {title: 'Sefaria'},
      ],
      fullkriyah: {
        '2': {k: 'Exodus', b: '25:17', e: '25:30', v: 14},
        '3': {k: 'Exodus', b: '25:31', e: '26:14', v: 24},
      },
    },
  });
});

test('parsha-alt-chabad-divisions', () => {
  const cases = {
    Bereshit: {
      '5': {k: 'Genesis', b: '4:19', e: '4:26', v: 8},
      '6': {k: 'Genesis', b: '5:1', e: '5:24', v: 24},
    },
    Vayigash: {
      '3': {k: 'Genesis', b: '45:8', e: '45:27', v: 20},
      '4': {k: 'Genesis', b: '45:28', e: '46:7', v: 8},
      '5': {k: 'Genesis', b: '46:8', e: '46:27', v: 20},
    },
    Nasso: {
      '1': {k: 'Numbers', b: '4:21', e: '4:28', v: 8},
      '2': {k: 'Numbers', b: '4:29', e: '4:49', v: 21},
      '6': {k: 'Numbers', b: '7:42', e: '7:83', v: 42},
      '7': {k: 'Numbers', b: '7:84', e: '7:89', v: 6},
    },
    Masei: {
      '1': {k: 'Numbers', b: '33:1', e: '33:49', v: 49},
      '2': {k: 'Numbers', b: '33:50', e: '33:53', v: 4},
      '3': {k: 'Numbers', b: '33:54', e: '34:15', v: 18},
    },
    Devarim: {
      '1': {k: 'Deuteronomy', b: '1:1', e: '1:11', v: 11},
      '2': {k: 'Deuteronomy', b: '1:12', e: '1:21', v: 10},
    },
  };
  for (const [parsha, fullkriyah] of Object.entries(cases)) {
    const reading = getLeyningForParsha(parsha);
    expect(reading.alt.chabad.fullkriyah, parsha).toEqual(fullkriyah);
    expect(reading.fullkriyahSrc, parsha).toEqual([
      {title: 'Koren'},
      {title: 'Etz Hayyim'},
      {title: 'USCJ Luach'},
    ]);
    expect(reading.alt.chabad.sources[0], parsha).toEqual({title: 'Chabad'});
  }
});

test('parsha-without-alt-has-no-alt', () => {
  const reading = getLeyningForParsha('Noach');
  expect(reading.alt).toBeUndefined();
  expect(reading.fullkriyahSrc).toBeUndefined();
});

test('lookupParsha-alt-reflects-json', () => {
  const meta = lookupParsha('Terumah');
  expect(meta.fullkriyahSrc).toEqual([
    {title: 'Koren'},
    {title: 'Etz Hayyim'},
    {title: 'USCJ Luach'},
  ]);
  expect(meta.alt).toEqual({
    chabad: {
      sources: [
        {title: 'Chabad'},
        {title: 'Torah Temimah'},
        {title: 'Tikkun Yissachar'},
        {title: 'Sefaria'},
      ],
      fullkriyah: {
        '2': ['25:17', '25:30'],
        '3': ['25:31', '26:14'],
      },
    },
  });
});

test('parsha-alt-translated-to-hebrew', () => {
  const reading = getLeyningForParsha('Terumah', 'he');
  expect(reading.alt.chabad.fullkriyah['2']).toEqual({
    k: 'שְׁמוֹת', b: 'כה:יז', e: 'כה:ל', v: 14,
  });
});

test('holiday-alt-sephardic-Chanukah', () => {
  const reading = getLeyningForHolidayKey('Chanukah Day 2');
  expect(reading.alt).toEqual({
    sephardic: {
      sources: [
        {
          title: 'Shulchan Aruch HaRav, ch. 17',
          url: 'https://shulchanaruchharav.com/halacha/chapter-17-the-torah-reading-of-chanukah-purim/',
        },
        {
          title: 'OU – Torah Reading for Chanukah',
          url: 'https://www.ou.org/holidays/information-torah-readings-chanukah/',
        },
      ],
      fullkriyah: {
        '1': {p: 35, k: 'Numbers', b: '7:18', e: '7:20', v: 3},
        '2': {p: 35, k: 'Numbers', b: '7:21', e: '7:23', v: 3},
        '3': {p: 35, k: 'Numbers', b: '7:18', e: '7:23', v: 6},
      },
    },
  });
});

test('holiday-alt-sephardic-Shmini-Atzeret', () => {
  const reading = getLeyningForHolidayKey('Shmini Atzeret');
  expect(reading.alt.sephardic.sources).toEqual([{title: 'unspecified'}]);
  expect(reading.alt.sephardic.fullkriyah['1']).toEqual({
    p: 47, k: 'Deuteronomy', b: '14:22', e: '15:23', v: 31,
  });
});
