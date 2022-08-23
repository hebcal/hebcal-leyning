import numverses from './numverses.json';

/**
 * Names of the books of the Torah. BOOK[1] === 'Genesis'
 * @readonly
 * @const {string[]}
 */
export const BOOK = ['', 'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy'];

/**
 * Formats parsha as a string
 * @private
 * @param {string[]} parsha
 * @return {string}
 */
export function parshaToString(parsha) {
  let s = parsha[0];
  if (parsha.length == 2) {
    s += '-' + parsha[1];
  }
  return s;
}

/**
 * Represents an aliyah
 * @typedef {Object} Aliyah
 * @property {string} k - Book (e.g. "Numbers")
 * @property {string} b - beginning verse (e.g. "28:9")
 * @property {string} e - ending verse (e.g. "28:15")
 * @property {number} [v] - number of verses
 * @property {number} [p] - parsha number (1=Bereshit, 54=Vezot HaBracha)
 */

/**
 * Makes a deep copy of the src object using JSON stringify and parse
 * @private
 * @param {any} src
 * @return {any}
 */
export function clone(src) {
  return JSON.parse(JSON.stringify(src));
}

/**
 * @private
 * @param {any} aliyah
 * @return {number}
 */
export function calculateNumVerses(aliyah) {
  if (aliyah.v) {
    return aliyah.v;
  }
  const chapVerseBegin = aliyah.b.split(':');
  const chapVerseEnd = aliyah.e.split(':');
  const c1 = parseInt(chapVerseBegin[0], 10);
  const c2 = parseInt(chapVerseEnd[0], 10);
  const v1 = parseInt(chapVerseBegin[1], 10);
  const v2 = parseInt(chapVerseEnd[1], 10);
  if (c1 === c2) {
    aliyah.v = v2 - v1 + 1;
  } else if (typeof aliyah.k === 'string') {
    const numv = numverses[aliyah.k];
    if (typeof numv !== 'object' || !numv.length) {
      throw new ReferenceError(`Can't find numverses for ${aliyah.k}`);
    }
    let total = numv[c1] - v1 + 1;
    for (let chap = c1 + 1; chap < c2; chap++) {
      total += numv[chap];
    }
    total += v2;
    aliyah.v = total;
  }
  return aliyah.v;
}

/**
 * @private
 * @param {string} haftara
 * @return {number}
 */
export function calculateHaftarahNumVerses(haftara) {
  const sections = haftara.split(/[;,]/);
  let total = 0;
  let prevBook;
  sections.forEach((haft) => {
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
        const haft = {k: hbook, b: cv[1], e: cv[2]};
        total += calculateNumVerses(haft);
      } else {
        total++; // Something like "Jeremiah 3:4" is 1 verse
      }
      prevBook = hbook;
    }
  });
  return total || undefined;
}

/**
 * Formats an aliyah object like "Numbers 28:9-28:15"
 * @param {Aliyah} a aliyah
 * @return {string}
 */
export function formatAliyahWithBook(a) {
  return `${a.k} ${a.b}-${a.e}`;
}

/**
 * Formats an aliyah object like "Numbers 28:9-15"
 * @param {Aliyah} aliyah
 * @param {boolean} showBook
 * @return {string}
 */
export function formatAliyahShort(aliyah, showBook) {
  const begin = aliyah.b;
  const end0 = aliyah.e;
  const prefix = showBook ? aliyah.k + ' ' : '';
  if (begin === end0) {
    return `${prefix}${begin}`;
  }
  const cv1 = begin.split(':');
  const cv2 = end0.split(':');
  const end = cv1[0] === cv2[0] ? cv2[1] : end0;
  return `${prefix}${begin}-${end}`;
}

/**
 * @private
 * @param {Aliyah[]} parts
 * @return {string}
 */
export function makeSummaryFromParts(parts) {
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
 * @private
 * @param {Aliyah|Aliyah[]} haft
 * @return {string}
 */
export function makeHaftaraSummary(haft) {
  if (!haft) {
    return haft;
  }
  const parts = Array.isArray(haft) ? haft : [haft];
  const str = makeSummaryFromParts(parts);
  // return str.replace(/-/g, ' - ');
  return str;
}

/**
 * @private
 * @param {Aliyah|Aliyah[]} haft
 * @return {number}
 */
export function calculateHaftaraNumV(haft) {
  return Array.isArray(haft) ? haft.reduce((prev, cur) => prev + cur.v, 0) : haft.v;
}

/**
 * @private
 * @param {Object.<string,string>} haft
 * @return {Object.<string,string>}
 */
export function cloneHaftara(haft) {
  if (!haft) {
    return haft;
  }
  const dest = clone(haft);
  if (Array.isArray(dest)) {
    dest.map(calculateNumVerses);
  } else {
    calculateNumVerses(dest);
  }
  return dest;
}
