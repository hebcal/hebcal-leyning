import {BOOK} from './common';
import festivals0 from './holiday-readings.json';
import {JsonFestivalAliyotMap, JsonFestivalLeyning} from './internalTypes';

type Festivals = Record<string, JsonFestivalLeyning>;

const festivals: Festivals = festivals0 as Festivals;

/**
 * Tests whether `holiday-readings.json` has a reading for the given key.
 * @param holiday an (untranslated) reading key, e.g. `'Purim'`
 * @returns `true` if a reading exists for this key
 */
export function hasFestival(holiday: string): boolean {
  return typeof festivals[holiday] === 'object';
}

function aliyotBookNumToStr(aliyot?: JsonFestivalAliyotMap) {
  if (aliyot) {
    for (const aliyah of Object.values(aliyot)) {
      if (typeof aliyah.k === 'number') {
        aliyah.k = BOOK[aliyah.k];
      }
    }
  }
}

/**
 * Returns the raw reading metadata for a holiday key from
 * `holiday-readings.json`, resolving any `alias` entry and normalizing book
 * numbers to English names.
 *
 * This is the underlying data; most callers want
 * {@link getLeyningForHolidayKey}, which builds a complete {@link Leyning}.
 * @param holiday an (untranslated) reading key, e.g. `'Purim'`
 * @returns the raw festival metadata, or `undefined` if the key is unknown
 */
export function lookupFestival(
  holiday: string
): JsonFestivalLeyning | undefined {
  let src = festivals[holiday];
  if (!src) {
    return undefined;
  }
  if (src.alias) {
    const tmp = festivals[src.key!];
    if (!tmp) {
      throw new Error(`Leyning alias ${holiday} => ${src.key} not found`);
    }
    src = tmp;
  }
  const result: JsonFestivalLeyning = src.fullkriyah
    ? structuredClone(src)
    : src;
  aliyotBookNumToStr(result.fullkriyah);
  aliyotBookNumToStr(result.alt);
  if (src.chabad && 'sameas' in src.chabad) {
    result.chabad = result.haft;
  }
  return result;
}
