import {expect, test} from 'vitest';
import {HDate, HebrewCalendar, ParshaEvent} from '@hebcal/core';
import {getLeyningForParshaHaShavua} from '../src/leyning';

// haftTheme: Haftarot of Admonition (תְּלָתָא דְּפוּרְעָנוּתָא, before Tish'a
// B'Av) and Consolation (שֶׁבַע דְּנֶחָמְתָא, after Tish'a B'Av)

// Returns {admonition, consolation} keyed by parsha name for every themed
// Haftarah in a Gregorian year
function haftThemes(gyear, il) {
  const events = HebrewCalendar.calendar(
    {year: gyear, isHebrewYear: false, sedrot: true, noHolidays: true});
  const result = {};
  for (const ev of events) {
    const reading = getLeyningForParshaHaShavua(ev, il);
    if (reading.admonition !== undefined || reading.consolation !== undefined) {
      result[ev.getDesc().replace('Parashat ', '')] = {
        admonition: reading.admonition,
        consolation: reading.consolation,
      };
    }
  }
  return result;
}

// Returns {admonition, consolation} for a single parsha, or undefined
function haftThemeFor(gyear, parshaName, il) {
  return haftThemes(gyear, il)[parshaName];
}

test('haftTheme - Matot-Masei combined year (2026), Pinchas after 17 Tammuz', () => {
  expect(haftThemes(2026, false)).toEqual({
    'Pinchas': {admonition: 1, consolation: undefined},
    'Matot-Masei': {admonition: 2, consolation: undefined},
    'Devarim': {admonition: 3, consolation: undefined},
    'Vaetchanan': {admonition: undefined, consolation: 1},
    'Eikev': {admonition: undefined, consolation: 2},
    "Re'eh": {admonition: undefined, consolation: 3},
    'Shoftim': {admonition: undefined, consolation: 4},
    'Ki Teitzei': {admonition: undefined, consolation: 5},
    'Ki Tavo': {admonition: undefined, consolation: 6},
    'Nitzavim-Vayeilech': {admonition: undefined, consolation: 7},
  });
});

test('haftTheme - Matot/Masei separate year (2014), plain Nitzavim-Vayeilech', () => {
  // Masei is read on 28 Tamuz (not Rosh Chodesh), so admonition 2 comes from
  // the base parsha haftTheme, not a special festival reading
  expect(haftThemes(2014, false)).toEqual({
    'Matot': {admonition: 1, consolation: undefined},
    'Masei': {admonition: 2, consolation: undefined},
    'Devarim': {admonition: 3, consolation: undefined},
    'Vaetchanan': {admonition: undefined, consolation: 1},
    'Eikev': {admonition: undefined, consolation: 2},
    "Re'eh": {admonition: undefined, consolation: 3},
    'Shoftim': {admonition: undefined, consolation: 4},
    'Ki Teitzei': {admonition: undefined, consolation: 5},
    'Ki Tavo': {admonition: undefined, consolation: 6},
    'Nitzavim-Vayeilech': {admonition: undefined, consolation: 7},
  });
});

test('haftTheme - plain Nitzavim (separate from Vayeilech) is consolation 7', () => {
  // 2005 has Nitzavim read on its own, before Rosh Hashana 5766
  expect(haftThemeFor(2005, 'Nitzavim', false)).toEqual(
    {admonition: undefined, consolation: 7});
});

test('haftTheme - Masei on Shabbat Rosh Chodesh is still admonition 2', () => {
  // 2005: Masei falls on 1 Av (Rosh Chodesh), so the Haftarah comes from the
  // special festival reading, which carries admonition 2
  expect(haftThemeFor(2005, 'Masei', false)).toEqual(
    {admonition: 2, consolation: undefined});
});

test('haftTheme - plain Ki Teitzei is consolation 5', () => {
  expect(haftThemeFor(2005, 'Ki Teitzei', false)).toEqual(
    {admonition: undefined, consolation: 5});
  expect(haftThemeFor(2014, 'Ki Teitzei', false)).toEqual(
    {admonition: undefined, consolation: 5});
});

test('haftTheme - Re\'eh on Rosh Chodesh defers 3rd Haftarah to Ki Teitzei (2022)', () => {
  // Re'eh reads the Shabbat Rosh Chodesh haftarah (Isaiah 66), so no theme
  expect(haftThemeFor(2022, "Re'eh", false)).toBe(undefined);
  // Ki Teitzei chants both the displaced 3rd and its own 5th
  expect(haftThemeFor(2022, 'Ki Teitzei', false)).toEqual(
    {admonition: undefined, consolation: '3,5'});
});

test('haftTheme - Ki Teitzei with 3rd Haftarah of Consolation in Israel too (2022)', () => {
  expect(haftThemeFor(2022, "Re'eh", true)).toBe(undefined);
  expect(haftThemeFor(2022, 'Ki Teitzei', true)).toEqual(
    {admonition: undefined, consolation: '3,5'});
});

test('haftTheme - Pinchas before 17 Tammuz has no theme (1981)', () => {
  const events = HebrewCalendar.calendar(
    {year: 1981, month: 7, isHebrewYear: false, sedrot: true, noHolidays: true});
  const ev = events.find((e) => e.getDesc() === 'Parashat Pinchas');
  const reading = getLeyningForParshaHaShavua(ev, false);
  expect(reading.admonition).toBe(undefined);
  expect(reading.consolation).toBe(undefined);
  expect(reading.haftara).toBe('I Kings 18:46-19:21');
});

test('haftTheme - Pinchas after 17 Tammuz is admonition 1 (1982)', () => {
  const events = HebrewCalendar.calendar(
    {year: 1982, month: 7, isHebrewYear: false, sedrot: true, noHolidays: true});
  const ev = events.find((e) => e.getDesc() === 'Parashat Pinchas');
  const reading = getLeyningForParshaHaShavua(ev, false);
  expect(reading.admonition).toBe(1);
  expect(reading.consolation).toBe(undefined);
  expect(reading.haftara).toBe('Jeremiah 1:1-2:3');
});

test('haftTheme - Vaetchanan (Shabbat Nachamu) carries consolation 1', () => {
  const ev = new ParshaEvent({
    hdate: new HDate(16, 'Av', 5782), parsha: ['Vaetchanan'], il: false});
  const reading = getLeyningForParshaHaShavua(ev, false);
  expect(reading.consolation).toBe(1);
  expect(reading.admonition).toBe(undefined);
  expect(reading.haftara).toBe('Isaiah 40:1-26');
});

test('haftTheme - regular Shabbat parsha has no theme', () => {
  const ev = new ParshaEvent({
    hdate: new HDate(23, 'Cheshvan', 5783), parsha: ['Chayei Sara'], il: false});
  const reading = getLeyningForParshaHaShavua(ev, false);
  expect(reading.admonition).toBe(undefined);
  expect(reading.consolation).toBe(undefined);
});

test('haftTheme - invariant: exactly 3 admonition and 7 consolation each year', () => {
  for (let gyear = 2000; gyear <= 2040; gyear++) {
    for (const il of [false, true]) {
      const themes = haftThemes(gyear, il);
      const admonitions = [];
      const consolations = [];
      for (const {admonition, consolation} of Object.values(themes)) {
        if (admonition !== undefined) admonitions.push(admonition);
        if (consolation !== undefined) consolations.push(consolation);
      }
      // Three Haftarot of Admonition, always 1, 2, 3
      expect(admonitions.sort()).toEqual([1, 2, 3]);
      // Seven Haftarot of Consolation. Usually 1..7, but when Re'eh coincides
      // with Rosh Chodesh the 3rd is folded into Ki Teitzei as "3,5"
      const sorted = consolations.map(String).sort();
      const usual = ['1', '2', '3', '4', '5', '6', '7'];
      const deferred = ['1', '2', '3,5', '4', '6', '7'].sort();
      expect([usual.join(), deferred.join()]).toContain(sorted.join());
    }
  }
});
