import {Locale} from './locale';
import numverses from './numverses.json';
import {Aliyah, AliyotMap, Leyning, TanakhBook, TorahBook} from './types';
import {makeLeyningParts, makeSummaryFromParts} from './summary';
import {formatVerseToHebrew} from './format';

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
 * Formats an aliyah object like "Numbers 28:9-28:15"
 */
export function formatAliyahWithBook(a: Aliyah): string {
  return `${a.k} ${a.b}-${a.e}`;
}

/**
 * Translates an aliyah's book name and verse numbers to the target language.
 * Modifies the aliyah object in place.
 * @param aliyah - The aliyah object to translate
 * @param language - The target language code (e.g., 'he' for Hebrew)
 * @param translateBook - Whether to translate the book name (default true)
 */
export function translateAliyah(aliyah: Aliyah, language: string): Aliyah {
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
  language: string = 'en'
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
