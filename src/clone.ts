import {Aliyah} from './types';
import {calculateNumVerses} from './common';
import {JsonFestivalAliyah} from './internalTypes';

/**
 * Makes a deep copy of the src object using JSON stringify and parse
 */
export function clone<T>(src: T): T {
  return JSON.parse(JSON.stringify(src));
}

export type Haftarah =
  | Aliyah
  | Aliyah[]
  | JsonFestivalAliyah
  | JsonFestivalAliyah[];

export function cloneHaftara(haft: Haftarah): Aliyah | Aliyah[] {
  if (!haft) {
    return haft;
  }
  const dest = clone(haft) as Aliyah | Aliyah[];
  if (Array.isArray(dest)) {
    dest.forEach(calculateNumVerses);
  } else {
    calculateNumVerses(dest);
  }
  return dest;
}

/**
 * Returns the total number of verses in an array of Aliyah (or haftarah) objects
 */
export function sumVerses(aliyot: Haftarah): number {
  return Array.isArray(aliyot)
    ? aliyot.reduce((prev, cur) => prev + cur.v!, 0)
    : aliyot.v!;
}
