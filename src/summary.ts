import {Locale} from './locale.js';
import {AliyotMap, Aliyah} from './types.js';
import {formatAliyahShort} from './format.js';

/**
 * @private
 */
function isChapVerseBefore(a: string, b: string): boolean {
  const cv1 = a.split(':').map(x => +x);
  const cv2 = b.split(':').map(x => +x);
  return cv1[0] * 100 + cv1[1] < cv2[0] * 100 + cv2[1];
}

/**
 * Formats one or more passages into a human-readable citation.
 *
 * Ranges from the same book are joined with commas
 * (`Isaiah 6:1-7:6, 9:5-6`); ranges from different books are joined with
 * semicolons (`Genesis 21:1-34; Numbers 29:1-6`).
 * @param parts a single passage or an array of passages
 * @param [language] language for book names (default `'en'`)
 * @returns the formatted citation
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
 * Collapses an `AliyotMap` into the minimal set of contiguous passages.
 *
 * Adjacent aliyot from the same book are merged; a non-contiguous passage
 * (such as a special 7th aliyah or maftir from another book) becomes its own
 * part. Useful for building a compact summary.
 * @param aliyot map of aliyot keyed by `'1'`–`'7'` plus `'M'`
 * @returns the contiguous passages, in reading order
 */
export function makeLeyningParts(aliyot: AliyotMap): Aliyah[] {
  const nums = Object.keys(aliyot).filter(x => {
    if (x.length === 1) {
      return true;
    }
    const code = x.codePointAt(0) ?? 0;
    return code >= 48 && code <= 57;
  });
  let start = aliyot[nums[0]];
  let end = start;
  const parts: Aliyah[] = [];
  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];
    const aliyah = aliyot[num];
    if (
      i === nums.length - 1 &&
      aliyah.k === start.k &&
      !isChapVerseBefore(aliyah.b, start.b) &&
      !isChapVerseBefore(end.e, aliyah.e)
    ) {
      // short-circuit when final aliyah is entirely contained within the
      // accumulated range (e.g. M inside of 7, or a repeated Chol ha-Moed
      // maftir that re-reads part of the preceding aliyot)
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
 * Builds a one-line summary of a Torah reading, e.g. `"Genesis 6:9-11:32"`.
 * Equivalent to {@link makeSummaryFromParts} applied to the output of
 * {@link makeLeyningParts}.
 * @param aliyot map of aliyot keyed by `'1'`–`'7'` plus `'M'`
 * @returns the formatted summary
 */
export function makeLeyningSummary(aliyot: AliyotMap): string {
  const parts = makeLeyningParts(aliyot);
  return makeSummaryFromParts(parts);
}
