import {Locale} from './locale';
import numverses from './numverses.json';
import {
  Aliyah,
  AliyotMap,
  HEBREW_NUMERALS,
  Leyning,
  TanakhBook,
  TorahBook,
} from './types';

/**
 * Names of the books of the Torah.
 *
 * `BOOK[1] === 'Genesis'`
 * @readonly
 */
export const BOOK: TorahBook[] = [
  '' as TorahBook,
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
export function subtractVerses(book: TanakhBook, from: string, to: string) {
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
export function addVerses(book: TanakhBook, from: string, numVerses: number) {
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
 * @private
 */
function isChapVerseBefore(a: string, b: string): boolean {
  const cv1 = a.split(':').map(x => +x);
  const cv2 = b.split(':').map(x => +x);
  return cv1[0] * 100 + cv1[1] < cv2[0] * 100 + cv2[1];
}

/**
 * Summarizes an `AliyotMap` by collapsing all adjacent aliyot.
 * Finds any non-overlapping parts (e.g. special 7th aliyah or maftir)
 */
export function makeLeyningParts(aliyot: AliyotMap): Aliyah[] {
  const nums = Object.keys(aliyot).filter(x => {
    if (x.length === 1) {
      return true;
    }
    const code = x.charCodeAt(0);
    return code >= 48 && code <= 57;
  });
  let start = aliyot[nums[0]];
  let end = start;
  const parts = [];
  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];
    const aliyah = aliyot[num];
    if (i === nums.length - 1 && aliyah.k === end.k && aliyah.e === end.e) {
      // short-circuit when final aliyah is within the previous (e.g. M inside of 7)
      continue;
    }
    const prevEndChap = +end.e.split(':')[0];
    const curStartChap = +aliyah.b.split(':')[0];
    const sameOrNextChap =
      curStartChap === prevEndChap || curStartChap === prevEndChap + 1;
    if (
      i !== 0 &&
      (aliyah.k !== start.k ||
        isChapVerseBefore(aliyah.b, start.e) ||
        !sameOrNextChap)
    ) {
      parts.push({k: start.k, b: start.b, e: end.e});
      start = aliyah;
    }
    end = aliyah;
  }
  parts.push({k: start.k, b: start.b, e: end.e});
  return parts;
}

/**
 * Returns a string representation of the leyning parts.
 * Separate verse ranges read from the same book are separated
 * by commas, e.g. `Isaiah 6:1-7:6, 9:5-6`.
 * Verse ranges from different books are separated by semicolons,
 * e.g. `Genesis 21:1-34; Numbers 29:1-6`.
 */
export function makeSummaryFromParts(
  parts: Aliyah | Aliyah[],
  language = 'en'
): string {
  if (!Array.isArray(parts)) {
    parts = [parts];
  }
  let prev = parts[0];
  let summary = formatAliyahShort(prev, true, language);
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    if (part.k === prev.k) {
      summary += ', ';
    } else {
      summary += `; ${Locale.gettext(part.k, language)} `;
    }
    summary += formatAliyahShort(part, false, language);
    prev = part;
  }
  return summary;
}

/**
 * Makes a summary of the leyning, like "Genesis 6:9-11:32"
 */
export function makeLeyningSummary(aliyot: AliyotMap): string {
  const parts = makeLeyningParts(aliyot);
  return makeSummaryFromParts(parts);
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
export function formatAliyahShort(
  aliyah: Aliyah,
  showBook: boolean,
  language = 'en'
): string {
  const isEnglish = language === 'en';
  const begin = isEnglish ? aliyah.b : formatVerseToHebrew(aliyah.b);
  const end0 = isEnglish ? aliyah.e : formatVerseToHebrew(aliyah.e);
  const prefix = showBook ? Locale.gettext(aliyah.k, language) + ' ' : '';

  if (begin === end0) {
    return `${prefix}${begin}`;
  }
  const cv1 = begin.split(':');
  const cv2 = end0.split(':');
  const end = cv1[0] === cv2[0] ? cv2[1] : end0;
  return `${prefix}${begin}-${end}`;
}

export function formatVerseToHebrew(verse: string): string {
  if (verse === undefined || verse === null) {
    return '';
  }
  const cv = verse.split(':');
  // if not number return empty string
  if (isNaN(parseInt(cv[0], 10)) || isNaN(parseInt(cv[1], 10))) {
    return verse;
  }
  return `${numberToHebrew(parseInt(cv[0], 10))}:${numberToHebrew(parseInt(cv[1], 10))}`;
}

/**
 * Converts a number (1-199) to its Hebrew letter equivalent (gematria)
 * Special handling for 15 and 16 to avoid spelling parts of God's name
 * @param num - Number to convert (1-199)
 * @returns Hebrew letter representation with gershayim (") between letters
 * @example
 * numberToHebrew(1)   // returns 'א'
 * numberToHebrew(15)  // returns 'טו' (not 'יה')
 * numberToHebrew(22)  // returns 'כ"ב'
 * numberToHebrew(100) // returns 'ק'
 * numberToHebrew(150) // returns 'ק"נ'
 */
export function numberToHebrew(num: number): string {
  if (num < 1 || num > 99) {
    throw new Error('Number must be between 1 and 100');
  }

  // single values
  const value = HEBREW_NUMERALS[num];
  if (value) {
    return value;
  }

  const tens = Math.floor(num / 10) * 10;
  const ones = num % 10;
  const result = HEBREW_NUMERALS[tens] + HEBREW_NUMERALS[ones];
  return result;
}

/**
 * Translates an aliyah's book name and verse numbers to the target language.
 * Modifies the aliyah object in place.
 * @param aliyah - The aliyah object to translate
 * @param language - The target language code (e.g., 'he' for Hebrew)
 * @param translateBook - Whether to translate the book name (default true)
 */
export function translateAliyah(
  aliyah: Aliyah,
  language: string,
): Aliyah {
  if (language === 'he') {
    aliyah.k = Locale.gettext(aliyah.k, language) as TanakhBook;
    aliyah.b = formatVerseToHebrew(aliyah.b);
    aliyah.e = formatVerseToHebrew(aliyah.e);
  }
  return aliyah;
}

/**
 * Translates aliyah(s) - handles single Aliyah, arrays, and AliyotMap.
 * For non-English languages, translates book names and converts verse numbers to Hebrew numerals.
 * Returns a new translated copy, leaving the original unchanged.
 * @param aliyahOrArray - Single Aliyah, array of Aliyah objects, AliyotMap, or undefined
 * @param language - The target language code (e.g., 'he' for Hebrew)
 * @param translateBook - Whether to translate the book name (default true)
 * @returns Translated copy of the input, or undefined if input was undefined
 */
export function translateAliyahOrArray<T extends Aliyah | Aliyah[] | AliyotMap>(
  aliyahOrArray: T,
  language: string = 'en',
): T {
  // Handle array of Aliyah objects
  if (Array.isArray(aliyahOrArray)) {
    const result = aliyahOrArray.map(aliyah => {
      const copy = {...aliyah};
      return translateAliyah(copy, language);
    });
    return result as T;
  }

  // Handle single Aliyah object (has 'k' or 'b' property)
  if ('k' in aliyahOrArray || 'b' in aliyahOrArray) {
    const copy = {...aliyahOrArray} as Aliyah;
    return translateAliyah(copy, language) as T;
  }

  // Handle AliyotMap (Record<string, Aliyah>)
  const result: AliyotMap = {};
  for (const [key, aliyah] of Object.entries(aliyahOrArray)) {
    const copy = {...(aliyah as Aliyah)};
    result[key] = translateAliyah(copy, language);
  }
  return result as T;
}

/**
 * Translates a Leyning object to the target language.
 * @param leyning - The Leyning object to translate
 * @param language - The target language code (e.g., 'he' for Hebrew)
 * @returns The translated Leyning object
 * @example
 * const leyning: Leyning = {
 *   seph: [{k: 'Genesis', b: '1:1', e: '1:5'}],
 *   haft: [{k: 'Genesis', b: '1:6', e: '1:10'}],
 *   megillah: [{k: 'Genesis', b: '1:11', e: '1:15'}],
 *   fullkriyah: [{k: 'Genesis', b: '1:16', e: '1:20'}],
 * };
 * const translatedLeyning = translateLeyning(leyning, 'he');
 * @todo add reason translation
 */
export function translateLeyning(leyning: Leyning, language: string): Leyning {
  if (language === 'en') {
    return leyning;
  }
  if (leyning.seph) {
    leyning.sephardic = makeSummaryFromParts(leyning.seph, language);
    leyning.seph = translateAliyahOrArray(leyning.seph, language);
  }
  if (leyning.haft) {
    leyning.haftara = makeSummaryFromParts(leyning.haft, language);
    leyning.haft = translateAliyahOrArray(leyning.haft, language);
  }
  if (leyning.megillah) {
    const parts = makeLeyningParts(leyning.megillah);
    const megillahSummary = makeSummaryFromParts(parts, language);
    leyning.megillah = translateAliyahOrArray(leyning.megillah, language);
      leyning.summary = megillahSummary;
  }
  if (leyning.fullkriyah) {
    const parts = makeLeyningParts(leyning.fullkriyah);
    // TODO: add check for summary in those cases getLeyningForHolidayKey
    if (typeof leyning.fullkriyah['1'] === 'object') {
      leyning.summary = makeSummaryFromParts(parts, language);
    }
    leyning.fullkriyah = translateAliyahOrArray(leyning.fullkriyah, language);
    if (leyning.summaryParts) {
      leyning.summaryParts = translateAliyahOrArray(
        leyning.summaryParts,
        language
      );
      leyning.summary = makeSummaryFromParts(leyning.summaryParts, language);
    }
  }
  if (leyning.weekday) {
    const parts = makeLeyningParts(leyning.weekday);
    leyning.weekday = translateAliyahOrArray(leyning.weekday, language);
    leyning.summary = makeSummaryFromParts(parts, language);
  }
  return leyning;
}
