import {calculateNumVerses} from './common.js';
import {Aliyah, NeviimBook} from './types.js';

/**
 * Counts the verses in a formatted Haftarah citation string such as
 * `'Isaiah 6:1-7:6, 9:5-6'` or `'Genesis 21:1-34; Numbers 29:1-6'`, parsing
 * the book names and verse ranges. A bare reference like `'Jeremiah 3:4'`
 * counts as one verse.
 * @param haftara a formatted Haftarah citation
 * @returns the total number of verses, or `undefined` if none could be parsed
 */
export function calculateHaftarahNumVerses(
  haftara: string
): number | undefined {
  const sections = haftara.split(/[;,]/);
  let total = 0;
  let prevBook = '';
  for (const haft of sections) {
    const matches = /^(([^\d]+)\s+)?(\d.+)$/.exec(haft.trim());
    if (matches !== null) {
      const hbook = matches[2] ? matches[2].trim() : prevBook;
      const hverses = matches[3].trim();
      const cv = /^(\d+:\d+)\s*-\s*(\d+(:\d+)?)$/.exec(hverses);
      if (cv) {
        if (!cv[2].includes(':')) {
          const chap = cv[1].substring(0, cv[1].indexOf(':'));
          cv[2] = `${chap}:${cv[2]}`;
        }
        const haft: Aliyah = {k: hbook as NeviimBook, b: cv[1], e: cv[2]};
        total += calculateNumVerses(haft);
      } else {
        total++; // Something like "Jeremiah 3:4" is 1 verse
      }
      prevBook = hbook;
    }
  }
  return total || undefined;
}
