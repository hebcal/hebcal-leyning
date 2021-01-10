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
 * A bit like Object.assign(), but just a shallow copy
 * @private
 * @param {any} target
 * @param {any} source
 * @return {any}
 */
export function shallowCopy(target, source) {
  Object.keys(source).forEach((k) => target[k] = source[k]);
  return target;
}

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
 * Makes Sefaria links by adding `href`, `verses` and `num` attributes to each aliyah.
 * CAUTION: Modifies the `aliyot` parameter instead of making a copy.
 * @param {Object<string,Aliyah>} aliyot aliyah map to decorate
 * @param {boolean} showBook display the book name in the `verses` field (e.g. for special Maftir)
 */
export function addSefariaLinksToLeyning(aliyot, showBook) {
  const book1 = aliyot['1'] && aliyot['1'].k;
  Object.keys(aliyot).forEach((num) => {
    const aliyah = aliyot[num];
    aliyah.num = num == 'M' ? 'maf' : num;
    const begin = aliyah.b.split(':');
    const end = aliyah.e.split(':');
    const endChapVerse = begin[0] === end[0] ? end[1] : aliyah.e;
    const verses = `${aliyah.b}-${endChapVerse}`;
    aliyah.verses = showBook || (book1 != aliyah.k) ? `${aliyah.k} ${verses}` : verses;
    const sefariaVerses = verses.replace(/:/g, '.');
    const sefAliyot = showBook ? '0' : '1';
    const url = `https://www.sefaria.org/${aliyah.k}.${sefariaVerses}?lang=bi&aliyot=${sefAliyot}`;
    aliyah.href = url;
  });
}

/**
 * @private
 * @param {any} aliyah
 */
export function calculateNumVerses(aliyah) {
  if (!aliyah.v) {
    const chapVerseBegin = aliyah.b.split(':');
    const chapVerseEnd = aliyah.e.split(':');
    if (chapVerseBegin[0] === chapVerseEnd[0]) {
      aliyah.v = (+chapVerseEnd[1] - +chapVerseBegin[1]) + 1;
    }
  }
}
