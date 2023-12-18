import {BOOK, clone} from './common.js';
import festivals from './holiday-readings.json.js';

/**
 * Is there a special festival Torah Reading for `holiday`?
 * @param {string} holiday
 * @return {boolean}
 */
export function hasFestival(holiday) {
  return typeof festivals[holiday] === 'object';
}

/**
 * Returns the raw metadata for festival reading for `holiday`
 * @param {string} holiday
 * @return {any}
 */
export function lookupFestival(holiday) {
  let src = festivals[holiday];
  if (typeof src === 'undefined') {
    return undefined;
  }
  if (src.alias) {
    const tmp = festivals[src.key];
    if (typeof tmp === 'undefined') {
      throw new Error(`Leyning alias ${holiday} => ${src.key} not found`);
    }
    src = tmp;
  }
  const result = src.fullkriyah ? clone(src) : src;
  if (result.fullkriyah) {
    for (const aliyah of Object.values(result.fullkriyah)) {
      if (typeof aliyah.k === 'number') {
        aliyah.k = BOOK[aliyah.k];
      }
    }
  }
  if (src.note) {
    result.note = src.note;
  }
  return result;
}
