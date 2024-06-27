import numverses from './numverses.json';
import { Aliyah } from './types';

/**
 * Names of the books of the Torah. BOOK[1] === 'Genesis'
 * @readonly
 */
export const BOOK = ['', 'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy'];

/**
 * Formats parsha as a string
 * @param parsha untranslated name like 'Pinchas' or ['Pinchas'] or ['Matot','Masei']
 */
export function parshaToString(parsha: string | string[]): string {
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

type NumVerses = {
  [key: string]: number[],
};

/**
 * Calculates the number of verses in an aliyah or haftara based on
 * the `b` (begin verse), `e` (end verse) and `k` (book).
 * Modifies `aliyah` by setting the `v` field.
 */
export function calculateNumVerses(aliyah: Aliyah): number {
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
    const numv = (numverses as NumVerses)[aliyah.k];
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
  return aliyah.v!;
}

/**
 * Formats an aliyah object like "Numbers 28:9-28:15"
 */
export function formatAliyahWithBook(a: Aliyah): string {
  return `${a.k} ${a.b}-${a.e}`;
}

/**
 * Formats an aliyah object like "Numbers 28:9-15"
 */
export function formatAliyahShort(aliyah: Aliyah, showBook: boolean): string {
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

