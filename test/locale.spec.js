import {expect, test} from 'vitest';
import {Locale} from '@hebcal/core';
import '../src/locale';

test('locale', () => {
  const enStr = 'Sukkot Shabbat Chol ha-Moed';
  expect(Locale.lookupTranslation(enStr, 'ashkenazi'))
    .toBe('Sukkos Shabbos Chol ha-Moed');
  expect(Locale.lookupTranslation(enStr, 'he'))
    .toBe('סוּכּוֹת שַׁבָּת חוֹל הַמּוֹעֵד');
  expect(Locale.lookupTranslation(enStr, 'he-x-NoNikud'))
    .toBe('סוכות שבת חול המועד');
  });
