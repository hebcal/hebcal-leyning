import {expect, test} from 'vitest';
import {Locale} from '@hebcal/core';
import '../src/locale';
  
test('locale', () => {
  expect(Locale.lookupTranslation('Sukkot Shabbat Chol ha-Moed', 'ashkenazi'))
    .toBe('Sukkos Shabbos Chol ha-Moed'); 
});
