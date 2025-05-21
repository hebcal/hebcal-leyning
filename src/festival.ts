import {BOOK} from './common';
import {clone} from './clone';
import festivals0 from './holiday-readings.json';
import {JsonFestivalAliyotMap, JsonFestivalLeyning} from './internalTypes';

type Festivals = {
  [key: string]: JsonFestivalLeyning;
};

const festivals: Festivals = festivals0 as Festivals;

/**
 * Is there a special festival Torah Reading for `holiday`?
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
 * Returns the raw metadata for festival reading for `holiday`
 */
export function lookupFestival(
  holiday: string
): JsonFestivalLeyning | undefined {
  let src = festivals[holiday];
  if (typeof src === 'undefined') {
    return undefined;
  }
  if (src.alias) {
    const tmp = festivals[src.key!];
    if (typeof tmp === 'undefined') {
      throw new Error(`Leyning alias ${holiday} => ${src.key} not found`);
    }
    src = tmp;
  }
  const result: JsonFestivalLeyning = src.fullkriyah ? clone(src) : src;
  aliyotBookNumToStr(result.fullkriyah);
  aliyotBookNumToStr(result.alt);
  if (src.note) {
    result.note = src.note;
  }
  return result;
}
