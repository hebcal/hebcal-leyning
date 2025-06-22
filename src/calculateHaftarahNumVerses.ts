import {calculateNumVerses} from './common';
import {Aliyah, NeviimBook, TanakhBook} from './types';

export function calculateHaftarahNumVerses(
  haftara: string
): number | undefined {
  const sections = haftara.split(/[;,]/);
  let total = 0;
  let prevBook = '';
  for (const haft of sections) {
    const matches = haft.trim().match(/^(([^\d]+)\s+)?(\d.+)$/);
    if (matches !== null) {
      const hbook = matches[2] ? matches[2].trim() : prevBook;
      const hverses = matches[3].trim();
      const cv = hverses.match(/^(\d+:\d+)\s*-\s*(\d+(:\d+)?)$/);
      if (cv) {
        if (cv[2].indexOf(':') === -1) {
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
