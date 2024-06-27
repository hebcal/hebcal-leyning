import { Event, Locale, flags } from '@hebcal/core';
import { calculateNumVerses } from './common';
import { clone, cloneHaftara, sumVerses } from './clone';
import { lookupFestival } from './festival';
import { HOLIDAY_IGNORE_MASK, getLeyningKeyForEvent } from './getLeyningKeyForEvent';
import numverses from './numverses.json';
import { makeLeyningParts, makeSummaryFromParts } from './summary';
import {
  Aliyah,
  AliyotMap,
  Leyning,
} from './types';

type NumVerses = {
  [key: string]: number[],
};

/**
 * Looks up leyning for a given holiday key. Key should be an
 * (untranslated) string used in holiday-readings.json. Returns some
 * of full kriyah aliyot, special Maftir, special Haftarah
 * @param key name from `holiday-readings.json` to find
 */
export function getLeyningForHolidayKey(key?: string, cholHaMoedDay?: number, il?: boolean): Leyning | undefined {
  if (typeof key !== 'string') {
    return undefined;
  }
  const src = lookupFestival(key);
  if (typeof src === 'undefined') {
    return undefined;
  }
  const israelOnly = (src as any).il;
  if (typeof israelOnly === 'boolean' && typeof il === 'boolean' && il !== israelOnly) {
    return undefined;
  }
  const leyning: any = {
    name: {
      en: key,
      he: Locale.lookupTranslation(key, 'he')!,
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
    Object.values(leyning.fullkriyah).map((aliyah) => calculateNumVerses(aliyah as Aliyah));
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
    const book: string = (src as any).megillah;
    const chaps = (numverses as NumVerses)[book];
    const m: AliyotMap = {};
    for (let i = 1; i < chaps.length; i++) {
      const numv = chaps[i];
      m[`${i}`] = {k: book, b: `${i}:1`, e: `${i}:${numv}`, v: numv};
    }
    leyning.megillah = m;
  }
  if (src.note) {
    leyning.note = src.note;
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
export function getLeyningForHoliday(ev: Event, il: boolean = false): Leyning | undefined {
  if (typeof ev !== 'object' || typeof ev.getFlags !== 'function') {
    throw new TypeError(`Bad event argument: ${JSON.stringify(ev)}`);
  } else if (typeof (ev as any).eventTime !== 'undefined') {
    return undefined;
  } else if (ev.getFlags() & flags.PARSHA_HASHAVUA) {
    throw new TypeError(`Event should be a holiday: ${ev.getDesc()}`);
  } else if (ev.getFlags() & HOLIDAY_IGNORE_MASK) {
    return undefined;
  }
  const key = getLeyningKeyForEvent(ev, il);
  const leyning = getLeyningForHolidayKey(key, (ev as any).cholHaMoedDay, il);
  return leyning;
}
