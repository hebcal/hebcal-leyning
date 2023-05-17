import {Locale, flags} from '@hebcal/core';
import {calculateNumVerses, clone, cloneHaftara, sumVerses} from './common';
import {makeSummaryFromParts} from './summary';
import {lookupFestival} from './festival';
import {makeLeyningParts} from './summary';
import {getLeyningKeyForEvent, HOLIDAY_IGNORE_MASK} from './getLeyningKeyForEvent';
import numverses from './numverses.json';

/**
 * Looks up leyning for a given holiday key. Key should be an
 * (untranslated) string used in holiday-readings.json. Returns some
 * of full kriyah aliyot, special Maftir, special Haftarah
 * @param {string} key name from `holiday-readings.json` to find
 * @param {number} [cholHaMoedDay]
 * @param {boolean} [il]
 * @return {Leyning} map of aliyot
 */
export function getLeyningForHolidayKey(key, cholHaMoedDay, il) {
  if (typeof key !== 'string') {
    return undefined;
  }
  const src = lookupFestival(key);
  if (typeof src === 'undefined') {
    return undefined;
  }
  if (typeof src.il === 'boolean' && typeof il === 'boolean' && il !== src.il) {
    return undefined;
  }
  const leyning = {
    name: {
      en: key,
      he: Locale.lookupTranslation(key, 'he'),
    },
  };
  if (src.fullkriyah) {
    leyning.fullkriyah = clone(src.fullkriyah);
    if (key === 'Sukkot Shabbat Chol ha-Moed' && cholHaMoedDay) {
      leyning.fullkriyah['M'] = leyning.fullkriyah[`M-day${cholHaMoedDay}`];
      for (let day = 1; day <= 5; day++) {
        delete leyning.fullkriyah[`M-day${day}`];
      }
    }
    if (typeof leyning.fullkriyah['1'] === 'object') {
      const parts = makeLeyningParts(leyning.fullkriyah);
      leyning.summary = makeSummaryFromParts(parts);
      if (parts.length > 1) {
        leyning.summaryParts = parts;
      }
    }
    Object.values(leyning.fullkriyah).map((aliyah) => calculateNumVerses(aliyah));
  }
  if (src.haft) {
    const haft = leyning.haft = cloneHaftara(src.haft);
    leyning.haftara = makeSummaryFromParts(haft);
    leyning.haftaraNumV = sumVerses(haft);
  }
  if (src.seph) {
    const seph = leyning.seph = cloneHaftara(src.seph);
    leyning.sephardic = makeSummaryFromParts(seph);
    leyning.sephardicNumV = sumVerses(seph);
  }
  if (src.megillah) {
    const book = src.megillah;
    const chaps = numverses[book];
    const m = {};
    for (let i = 1; i < chaps.length; i++) {
      const numv = chaps[i];
      m[`${i}`] = {k: book, b: `${i}:1`, e: `${i}:${numv}`, v: numv};
    }
    leyning.megillah = m;
  }
  return leyning;
}

/**
 * Looks up leyning for a given holiday. Returns some
 * of full kriyah aliyot, special Maftir, special Haftarah
 * @param {Event} ev the Hebcal event associated with this leyning
 * @param {boolean} [il] true if Israel holiday scheme
 * @return {Leyning} map of aliyot
 */
export function getLeyningForHoliday(ev, il = false) {
  if (typeof ev !== 'object' || typeof ev.getFlags !== 'function') {
    throw new TypeError(`Bad event argument: ${ev}`);
  } else if (typeof ev.eventTime !== 'undefined') {
    return undefined;
  } else if (ev.getFlags() & flags.PARSHA_HASHAVUA) {
    throw new TypeError(`Event should be a holiday: ${ev.getDesc()}`);
  } else if (ev.getFlags() & HOLIDAY_IGNORE_MASK) {
    return undefined;
  }
  const key = getLeyningKeyForEvent(ev, il);
  const leyning = getLeyningForHolidayKey(key, ev.cholHaMoedDay, il);
  return leyning;
}
