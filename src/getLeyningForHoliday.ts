import {Event, flags} from '@hebcal/core/dist/esm/event';
import {Locale} from './locale';
import {calculateNumVerses, NUM_VERSES, translateLeyning} from './common';
import {makeLeyningParts, makeSummaryFromParts} from './summary';
import {clone, cloneHaftara, sumVerses} from './clone';
import {lookupFestival} from './festival';
import {
  HOLIDAY_IGNORE_MASK,
  getLeyningKeyForEvent,
} from './getLeyningKeyForEvent';
import {Aliyah, AliyotMap, KetuvimBook, Leyning} from './types';

/**
 * Looks up leyning for a given holiday key. Key should be an
 * (untranslated) string used in holiday-readings.json. Returns some
 * of full kriyah aliyot, special Maftir, special Haftarah
 * @param key name from `holiday-readings.json` to find
 * @param cholHaMoedDay
 * @param il true if Israel holiday scheme
 * @param language language for summary (default 'en')
 */
export function getLeyningForHolidayKey(
  key?: string,
  cholHaMoedDay?: number,
  il?: boolean,
  language: string = 'en'
): Leyning | undefined {
  if (typeof key !== 'string') {
    return undefined;
  }
  const src = lookupFestival(key);
  if (typeof src === 'undefined') {
    return undefined;
  }
  const israelOnly = src.il;
  if (
    typeof israelOnly === 'boolean' &&
    typeof il === 'boolean' &&
    il !== israelOnly
  ) {
    return undefined;
  }
  const leyning: Partial<Leyning> = {
    name: {
      en: key,
      he: Locale.lookupTranslation(key, 'he')!,
    },
    type: 'holiday',
  };
  if (src.fullkriyah) {
    leyning.fullkriyah = clone(src.fullkriyah) as AliyotMap;
    if (key === 'Sukkot Shabbat Chol ha-Moed' && cholHaMoedDay) {
      leyning.fullkriyah['M'] = leyning.fullkriyah[`M-day${cholHaMoedDay}`];
      for (let day = 1; day <= 5; day++) {
        delete leyning.fullkriyah[`M-day${day}`];
      }
    }
    if (typeof leyning.fullkriyah['1'] === 'object') {
      const parts = makeLeyningParts(leyning.fullkriyah);
      leyning.summary = makeSummaryFromParts(parts);
      leyning.summaryParts = parts;
    }
    Object.values(leyning.fullkriyah).forEach(aliyah =>
      calculateNumVerses(aliyah as Aliyah)
    );
    if (src.alt) {
      leyning.alt = clone(src.alt) as AliyotMap;
      for (const aliyah of Object.values(leyning.alt)) {
        calculateNumVerses(aliyah as Aliyah);
      }
    }
  }
  if (src.haft) {
    const haft = (leyning.haft = cloneHaftara(src.haft));
    leyning.haftara = makeSummaryFromParts(haft);
    leyning.haftaraNumV = sumVerses(haft);
  }
  if (src.seph) {
    const seph = (leyning.seph = cloneHaftara(src.seph));
    leyning.sephardic = makeSummaryFromParts(seph);
    leyning.sephardicNumV = sumVerses(seph);
  }
  let megillah = src.megillah as KetuvimBook;
  if (il && key === 'Pesach I (on Shabbat)') megillah = 'Song of Songs';
  if (megillah) {
    const chaps = NUM_VERSES[megillah];
    const m: AliyotMap = {};
    for (let i = 1; i < chaps.length; i++) {
      const numv = chaps[i];
      m[`${i}`] = {k: megillah, b: `${i}:1`, e: `${i}:${numv}`, v: numv};
    }
    leyning.megillah = m;
    const parts = makeLeyningParts(m);
    if (leyning.summaryParts) {
      leyning.summaryParts.push(...parts);
    }
    const megillahSummary = makeSummaryFromParts(parts);
    leyning.summary = leyning.summary
      ? leyning.summary + '; ' + megillahSummary
      : megillahSummary;
  }
  if (src.note) {
    leyning.note = src.note;
  }
  return translateLeyning(leyning as Leyning, language);
}

/**
 * Looks up leyning for a given holiday. Returns some
 * of full kriyah aliyot, special Maftir, special Haftarah
 * @param ev the Hebcal event associated with this leyning
 * @param [il] true if Israel holiday scheme
 * @param [language] language for summary (default 'en')
 * @returns map of aliyot
 */
export function getLeyningForHoliday(
  ev: Event,
  il = false,
  language: string = 'en'
): Leyning | undefined {
  if (typeof ev !== 'object' || typeof ev.getFlags !== 'function') {
    throw new TypeError(`Bad event argument: ${JSON.stringify(ev)}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } else if ((ev as any).eventTime !== undefined) {
    // Events with eventTime are not supported for leyning lookup
    return undefined;
  } else if (ev.getFlags() & flags.PARSHA_HASHAVUA) {
    throw new TypeError(`Event should be a holiday: ${ev.getDesc()}`);
  } else if (ev.getFlags() & HOLIDAY_IGNORE_MASK) {
    return undefined;
  }
  const key = getLeyningKeyForEvent(ev, il);

  const leyning = getLeyningForHolidayKey(
    key,
    (ev as any).cholHaMoedDay, // eslint-disable-line @typescript-eslint/no-explicit-any
    il,
    language
  );
  return leyning;
}
