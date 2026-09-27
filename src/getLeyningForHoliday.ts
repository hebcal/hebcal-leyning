import {Event, flags} from '@hebcal/core/dist/esm/event';
import {Locale} from './locale.js';
import {calculateNumVerses, NUM_VERSES} from './common.js';
import {translateLeyning} from './translate.js';
import {makeLeyningParts, makeSummaryFromParts} from './summary.js';
import {cloneHaftara, sumVerses} from './clone.js';
import {lookupFestival} from './festival.js';
import {
  HOLIDAY_IGNORE_MASK,
  getLeyningKeyForEvent,
  isModernHolidayWithReading,
} from './getLeyningKeyForEvent.js';
import {AliyotMap, KetuvimBook, Leyning} from './types.js';

/**
 * Looks up the leyning for a holiday by its (untranslated) reading key —
 * one of the keys in `holiday-readings.json`.
 *
 * Most callers should use {@link getLeyningForHoliday}, which derives the key
 * from an event; use this directly only when you already know the key.
 * @param [key] reading name from `holiday-readings.json`, e.g.
 *   `'Yom Kippur (Morning)'`. Returns `undefined` if omitted or unknown.
 * @param [cholHaMoedDay] day within Chol ha-Moed, used to pick the correct
 *   maftir for `'Sukkot Shabbat Chol ha-Moed'`
 * @param [il] `true` for the Israel schedule; filters out readings that apply
 *   only to the other schedule
 * @param [language] language for names and summary (default `'en'`)
 * @returns the holiday leyning, or `undefined` if there is no such reading
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
  if (!src) {
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
    leyning.fullkriyah = structuredClone(src.fullkriyah) as AliyotMap;
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
      calculateNumVerses(aliyah)
    );
    if (src.alt) {
      leyning.alt = structuredClone(src.alt) as AliyotMap;
      for (const aliyah of Object.values(leyning.alt)) {
        calculateNumVerses(aliyah);
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
  if (src.chabad) {
    if ('sameas' in src.chabad) {
      leyning.chabad = leyning.haft;
    } else {
      leyning.chabad = cloneHaftara(src.chabad);
    }
  }
  let megillah = src.megillah as KetuvimBook | undefined;
  if (il) {
    if (key === 'Pesach I (on Shabbat)') {
      megillah = 'Song of Songs';
    } else if (key === 'Sukkot I (on Shabbat)') {
      megillah = 'Ecclesiastes';
    } else if (
      key === 'Shmini Atzeret (on Shabbat)'
    ) {
      megillah = undefined;
    }
  }
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
 * Looks up the leyning for a holiday event.
 *
 * Depending on the holiday, the result may include the full kriyah, a special
 * maftir, one or more Haftarot, and/or a megillah.
 * @param ev a Hebcal holiday event (not a parsha hashavua event)
 * @param [il] `true` for the Israel schedule (default `false`)
 * @param [language] language for names and summary (default `'en'`)
 * @returns the holiday leyning, or `undefined` if this event has no reading
 * @throws {TypeError} if `ev` is not a valid event or is a parsha event
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
  } else if (
    ev.getFlags() & HOLIDAY_IGNORE_MASK &&
    !isModernHolidayWithReading(ev)
  ) {
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
