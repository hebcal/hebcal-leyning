import numverses from './numverses.json';
import {Aliyah} from './types';

/**
 * Names of the books of the Torah.
 *
 * `BOOK[1] === 'Genesis'`
 * @readonly
 */
export const BOOK = [
  '',
  'Genesis',
  'Exodus',
  'Leviticus',
  'Numbers',
  'Deuteronomy',
] as const;

/**
 * The number of verses in each book of the Tanakh.
 * Indexed by English transliterated name of book,
 * and arrays are 1-based.
 *
 * There are 51 chapters in Genesis, so
 * `NUM_VERSES['Genesis'].length === 51`.
 *
 * There are 26 verses in Genesis chapter 4,
 * so `NUM_VERSES['Genesis'][4] === 26`.
 * @readonly
 */
export const NUM_VERSES: Record<string, readonly number[]> = numverses;

/**
 * Formats parsha as a string
 * @param parsha untranslated name like 'Pinchas' or ['Pinchas'] or ['Matot','Masei']
 */
export function parshaToString(parsha: string | string[]): string {
  if (typeof parsha === 'string') {
    return parsha;
  } else if (
    !Array.isArray(parsha) ||
    parsha.length === 0 ||
    parsha.length > 2
  ) {
    throw new TypeError(`Bad parsha argument: ${parsha}`);
  }
  let s = parsha[0];
  if (parsha.length === 2) {
    s += '-' + parsha[1];
  }
  return s;
}

/**
 * Calculates the number of verses in an aliyah or haftara based on
 * the `b` (begin verse), `e` (end verse) and `k` (book).
 * Modifies `aliyah` by setting the `v` field.
 */
export function calculateNumVerses(aliyah: Aliyah): number {
  if (aliyah.v) {
    return aliyah.v;
  }
  aliyah.v = subtractVerses(aliyah.k, aliyah.b, aliyah.e) + 1;
  return aliyah.v;
}

/**
 * Finds the number of verses between two locations in the same book.
 * @param book The English name of the book (e.g. "Numbers")
 * @param from The starting verse (e.g. "28:9")
 * @param to The ending verse (e.g. "28:15")
 * @returns The number of verses between the two locations, excluding the `to` verse.
 */
export function subtractVerses(book: string, from: string, to: string) {
  const chapVerseBegin = from.split(':');
  const chapVerseEnd = to.split(':');
  const c1 = parseInt(chapVerseBegin[0], 10);
  const c2 = parseInt(chapVerseEnd[0], 10);
  const v1 = parseInt(chapVerseBegin[1], 10);
  const v2 = parseInt(chapVerseEnd[1], 10);
  let result = 0;
  if (c1 === c2) {
    return v2 - v1;
  }
  const numv = NUM_VERSES[book];
  if (typeof numv !== 'object' || !numv.length) {
    throw new ReferenceError(`Can't find numverses for ${book}`);
  }
  let total = numv[c1] - v1;
  for (let chap = c1 + 1; chap < c2; chap++) {
    total += numv[chap];
  }
  total += v2;
  result = total;
  return result;
}

/**
 * Calculates the next verse after adding a number of verses to a given location.
 * @param book The English name of the book (e.g. "Numbers")
 * @param from The starting verse (e.g. "28:9")
 * @param numVerses The number of verses to add; must be nonnegative.
 * @returns The next verse after adding the specified number of verses,
 *          or null if the resulting verse exceeds the number of verses
 *          in the book.
 */
export function addVerses(book: string, from: string, numVerses: number) {
  const chapVerseBegin = from.split(':');
  const c1 = parseInt(chapVerseBegin[0], 10);
  const v1 = parseInt(chapVerseBegin[1], 10);
  const numv = NUM_VERSES[book];
  if (typeof numv !== 'object' || !numv.length) {
    throw new ReferenceError(`Can't find numverses for ${book}`);
  }
  let total = v1 + numVerses;
  let c2 = c1;
  while (total > numv[c2]) {
    total -= numv[c2];
    c2++;
    if (!numv[c2]) return null;
  }
  return `${c2}:${total}`;
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
