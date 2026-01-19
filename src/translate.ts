import {Aliyah, AliyotMap, Leyning, TanakhBook} from './types';
import {makeSummaryFromParts, makeLeyningParts} from './summary';
import {Locale} from './locale';
import {formatVerseToHebrew} from './format';

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
