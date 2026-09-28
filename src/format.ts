import {gematriya} from '@hebcal/hdate';
import {Locale} from './locale.js';
import {Aliyah} from './types.js';

function gematriya2(num: number): string {
  const str = gematriya(num);
  return str.replaceAll(/[׳״]/g, '');
}

/**
 * Converts a `chapter:verse` string to Hebrew numerals (gematriya), e.g.
 * `'28:9'` becomes `'כח:ט'`. Returns the input unchanged if it is not a valid
 * `chapter:verse`, or `''` for `null`/`undefined`.
 * @param chapVerse a `chapter:verse` string
 * @returns the verse with chapter and verse in Hebrew numerals
 */
export function formatVerseToHebrew(chapVerse: string): string {
  if (chapVerse === undefined || chapVerse === null) {
    return '';
  }
  const cv = chapVerse.split(':');
  const chapter = Number.parseInt(cv[0], 10);
  const verse = Number.parseInt(cv[1], 10);
  // if not number return empty string
  if (Number.isNaN(chapter) || Number.isNaN(verse)) {
    return chapVerse;
  }
  return `${gematriya2(chapter)}:${gematriya2(verse)}`;
}

/**
 * Formats a passage compactly, omitting a repeated chapter number in the end
 * verse, e.g. `"Numbers 28:9-15"` (versus `"Numbers 28:9-28:15"`).
 * @param aliyah the passage to format
 * @param showBook whether to prefix the book name
 * @param [language] language for the book name and numerals (default `'en'`)
 * @returns the formatted citation
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
