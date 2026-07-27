import {Aliyah} from './types';
import {calculateNumVerses} from './common';
import {JsonFestivalAliyah} from './internalTypes';

/**
 * Makes a deep copy of the src object using JSON stringify and parse
 * @deprecated Use structuredClone instead
 */
export function clone<T>(src: T): T {
  return structuredClone(src);
}

export type Haftarah =
  | Aliyah
  | Aliyah[]
  | JsonFestivalAliyah
  | JsonFestivalAliyah[];

/**
 * Deep-clones a Haftarah (a single passage or an array) and fills in the
 * verse count `v` on each passage via {@link calculateNumVerses}.
 * @param haft the Haftarah to clone
 * @returns a new Haftarah with verse counts populated
 */
export function cloneHaftara(haft: Haftarah): Aliyah | Aliyah[] {
  if (!haft) {
    return haft;
  }
  const dest = structuredClone(haft) as Aliyah | Aliyah[];
  if (Array.isArray(dest)) {
    dest.forEach(calculateNumVerses);
  } else {
    calculateNumVerses(dest);
  }
  return dest;
}

/**
 * Sums the verse counts (`v`) of a Haftarah's passages. Each passage must
 * already have its `v` populated (e.g. by {@link cloneHaftara}).
 * @param aliyot a single passage or an array of passages
 * @returns the total number of verses
 */
export function sumVerses(aliyot: Haftarah): number {
  return Array.isArray(aliyot)
    ? aliyot.reduce((prev, cur) => prev + cur.v!, 0)
    : aliyot.v!;
}
