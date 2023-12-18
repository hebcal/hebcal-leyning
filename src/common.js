import numverses from './numverses.json.js';

/**
 * Names of the books of the Torah. BOOK[1] === 'Genesis'
 * @readonly
 * @const {string[]}
 */
export const BOOK = ['', 'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy'];

/**
 * Formats parsha as a string
 * @param {string|string[]} parsha untranslated name like 'Pinchas' or ['Pinchas'] or ['Matot','Masei']
 * @return {string}
 */
export function parshaToString(parsha) {
  if (typeof parsha === 'string') {
    return parsha;
  } else if (!Array.isArray(parsha) || parsha.length === 0 || parsha.length > 2) {
    throw new TypeError(`Bad parsha argument: ${parsha}`);
  }
  let s = parsha[0];
  if (parsha.length == 2) {
    s += '-' + parsha[1];
  }
  return s;
}

/**
 * Represents an aliyah
 * @typedef {Object} Aliyah
 * @property {string} k - Book (e.g. "Numbers")
 * @property {string} b - beginning verse (e.g. "28:9")
 * @property {string} e - ending verse (e.g. "28:15")
 * @property {number} [v] - number of verses
 * @property {number} [p] - parsha number (1=Bereshit, 54=Vezot HaBracha)
 */

/**
 * Makes a deep copy of the src object using JSON stringify and parse
 * @param {any} src
 * @return {any}
 */
export function clone(src) {
  return JSON.parse(JSON.stringify(src));
}

/**
 * Calculates the number of verses in an aliyah or haftara based on
 * the `b` (begin verse), `e` (end verse) and `k` (book).
 * Modifies `aliyah` by setting the `v` field.
 * @param {Aliyah} aliyah
 * @return {number}
 */
export function calculateNumVerses(aliyah) {
  if (aliyah.v) {
    return aliyah.v;
  }
  const chapVerseBegin = aliyah.b.split(':');
  const chapVerseEnd = aliyah.e.split(':');
  const c1 = parseInt(chapVerseBegin[0], 10);
  const c2 = parseInt(chapVerseEnd[0], 10);
  const v1 = parseInt(chapVerseBegin[1], 10);
  const v2 = parseInt(chapVerseEnd[1], 10);
  if (c1 === c2) {
    aliyah.v = v2 - v1 + 1;
  } else if (typeof aliyah.k === 'string') {
    const numv = numverses[aliyah.k];
    if (typeof numv !== 'object' || !numv.length) {
      throw new ReferenceError(`Can't find numverses for ${aliyah.k}`);
    }
    let total = numv[c1] - v1 + 1;
    for (let chap = c1 + 1; chap < c2; chap++) {
      total += numv[chap];
    }
    total += v2;
    aliyah.v = total;
  }
  return aliyah.v;
}

/**
 * Formats an aliyah object like "Numbers 28:9-28:15"
 * @param {Aliyah} a aliyah
 * @return {string}
 */
export function formatAliyahWithBook(a) {
  return `${a.k} ${a.b}-${a.e}`;
}

/**
 * Formats an aliyah object like "Numbers 28:9-15"
 * @param {Aliyah} aliyah
 * @param {boolean} showBook
 * @return {string}
 */
export function formatAliyahShort(aliyah, showBook) {
  const begin = aliyah.b;
  const end0 = aliyah.e;
  const prefix = showBook ? aliyah.k + ' ' : '';
  if (begin === end0) {
    return `${prefix}${begin}`;
  }
  const cv1 = begin.split(':');
  const cv2 = end0.split(':');
  const end = cv1[0] === cv2[0] ? cv2[1] : end0;
  return `${prefix}${begin}-${end}`;
}

/**
 * Returns the total number of verses in an array of Aliyah (or haftarah) objects
 * @param {Aliyah|Aliyah[]} aliyot
 * @return {number}
 */
export function sumVerses(aliyot) {
  return Array.isArray(aliyot) ? aliyot.reduce((prev, cur) => prev + cur.v, 0) : aliyot.v;
}

/**
 * @private
 * @param {Aliyah|Aliyah[]} haft
 * @return {Aliyah|Aliyah[]}
 */
export function cloneHaftara(haft) {
  if (!haft) {
    return haft;
  }
  const dest = clone(haft);
  if (Array.isArray(dest)) {
    dest.map(calculateNumVerses);
  } else {
    calculateNumVerses(dest);
  }
  return dest;
}
