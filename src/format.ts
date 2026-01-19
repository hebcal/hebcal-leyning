import {gematriya} from '@hebcal/hdate';
import {Locale} from '@hebcal/core/dist/esm/locale';
import {Aliyah} from './types';

function gematriya2(num: number): string {
  const str = gematriya(num);
  return str.replaceAll(/[׳״]/g, '');
}

export function formatVerseToHebrew(chapVerse: string): string {
  if (chapVerse === undefined || chapVerse === null) {
    return '';
  }
  const cv = chapVerse.split(':');
  const chapter = parseInt(cv[0], 10);
  const verse = parseInt(cv[1], 10);
  // if not number return empty string
  if (isNaN(chapter) || isNaN(verse)) {
    return chapVerse;
  }
  return `${gematriya2(chapter)}:${gematriya2(verse)}`;
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
