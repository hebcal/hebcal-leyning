import {formatAliyahShort} from './common';

/**
 * @private
 * @param {string} a
 * @param {string} b
 * @return {boolean}
 */
function isChapVerseBefore(a, b) {
  const cv1 = a.split(':').map((x) => +x);
  const cv2 = b.split(':').map((x) => +x);
  return (cv1[0]*100 + cv1[1]) < (cv2[0]*100 + cv2[1]);
}

/**
 * Summarizes an `AliyotMap` by collapsing all adjacent aliyot.
 * Finds any non-overlapping parts (e.g. special 7th aliyah or maftir)
 * @param {Object<string,Aliyah>} aliyot
 * @return {Aliyah[]}
 */
export function makeLeyningParts(aliyot) {
  const nums = Object.keys(aliyot).filter((x) => x.length === 1);
  let start = aliyot[nums[0]];
  let end = start;
  const parts = [];
  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];
    const aliyah = aliyot[num];
    if ((i === nums.length - 1) && (aliyah.k === end.k) && (aliyah.e === end.e)) {
      // short-circuit when final aliyah is within the previous (e.g. M inside of 7)
      continue;
    }
    const prevEndChap = +(end.e.split(':')[0]);
    const curStartChap = +(aliyah.b.split(':')[0]);
    const sameOrNextChap = curStartChap === prevEndChap || curStartChap === prevEndChap + 1;
    if ((i !== 0) &&
      (aliyah.k !== start.k || isChapVerseBefore(aliyah.b, start.e) || !sameOrNextChap)) {
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
 * @param {Aliyah|Aliyah[]} parts
 * @return {string}
 */
export function makeSummaryFromParts(parts) {
  if (!Array.isArray(parts)) {
    parts = [parts];
  }
  let prev = parts[0];
  let summary = formatAliyahShort(prev, true);
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    if (part.k === prev.k) {
      summary += ', ';
    } else {
      summary += `; ${part.k} `;
    }
    summary += formatAliyahShort(part, false);
    prev = part;
  }
  return summary;
}

/**
 * Makes a summary of the leyning, like "Genesis 6:9-11:32"
 * @param {Object<string,Aliyah>} aliyot
 * @return {string}
 */
export function makeLeyningSummary(aliyot) {
  const parts = makeLeyningParts(aliyot);
  return makeSummaryFromParts(parts);
}
