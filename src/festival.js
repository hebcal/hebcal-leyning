import festivals from './holiday-readings.json';
import {BOOK, clone} from './common';

/**
 * @private
 * @param {string} key
 * @return {boolean}
 */
export function hasFestival(key) {
  return typeof festivals[key] === 'object';
}

/**
 * @private
 * @param {string} key
 * @return {any}
 */
export function lookupFestival(key) {
  let src = festivals[key];
  if (typeof src === 'undefined') {
    return undefined;
  }
  if (src.alias) {
    const tmp = festivals[src.key];
    if (typeof tmp === 'undefined') {
      throw new Error(`Leying key ${key} => ${src.key} not found`);
    }
    src = tmp;
  }
  const result = src.fullkriyah ? clone(src) : src;
  if (result.fullkriyah) {
    Object.values(result.fullkriyah).forEach((aliyah) => {
      if (typeof aliyah.k === 'number') {
        aliyah.k = BOOK[aliyah.k];
      }
    });
  }
  return result;
}
