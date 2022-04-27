import {HebrewCalendar, months, flags, Event} from '@hebcal/core';
import {BOOK, calculateNumVerses, clone} from './common';
import festivals from './holiday-readings.json';
import parshiyotObj from './aliyot.json';

/**
 * Represents an aliyah
 * @private
 * @typedef {Object} Aliyah
 * @property {string} k - Book (e.g. "Numbers")
 * @property {string} b - beginning verse (e.g. "28:9")
 * @property {string} e - ending verse (e.g. "28:15")
 * @property {number} [v] - number of verses
 * @property {number} [p] - parsha number (1=Bereshit, 54=Vezot HaBracha)
 */

/**
 * Leyning for a parsha hashavua or holiday
 * @typedef {Object} Leyning
 * @property {string} summary
 * @property {Aliyah} haft - Haftarah
 * @property {string} haftara - Haftarah
 * @property {number} [haftaraNumV]
 * @property {Aliyah} [seph] - Haftarah for Sephardic
 * @property {string} [sephardic] - Haftarah for Sephardic
 * @property {number} [sephardicNumV]
 * @property {Object<string,Aliyah>} fullkriyah
 * @property {Object<string,Aliyah>} [weekday]
 * @property {Object} [reason]
 */

/**
 * Based on the event date, type and title, finds the relevant leyning key
 * @param {Event} e event
 * @param {boolean} [il] true if Israel holiday scheme
 * @return {string} key to look up in holiday-reading.json
 */
export function getLeyningKeyForEvent(e, il=false) {
  const mask = e.getFlags();
  if (mask & HOLIDAY_IGNORE_MASK) {
    return undefined;
  }
  // Skip all Erevs except for Simchat Torah
  const desc = e.getDesc();
  if (mask & flags.EREV && desc !== 'Erev Simchat Torah') {
    return undefined;
  }
  const hd = e.getDate();
  const day = hd.getDate();
  const dow = hd.abs() % 7;
  const month = hd.getMonth();
  const isShabbat = (dow == 6);
  const isRoshChodesh = (day == 1 || day == 30);
  const holiday = e.basename();
  const isPesach = holiday === 'Pesach';
  if (il && isPesach) {
    if (isShabbat) {
      return day === 15 || day === 21 ? desc + ' (on Shabbat)' : 'Pesach Shabbat Chol ha-Moed';
    }
    return desc;
  }
  if (day == 1 && month === months.TISHREI) {
    return isShabbat ? 'Rosh Hashana I (on Shabbat)' : 'Rosh Hashana I';
  } else if (e.cholHaMoedDay) {
    // Sukkot or Pesach
    if (isShabbat) {
      return holiday + ' Shabbat Chol ha-Moed';
    } else if (desc == 'Sukkot VII (Hoshana Raba)') {
      return 'Sukkot Final Day (Hoshana Raba)';
    }
    // If Shabbat falls on the third day of Chol ha-Moed Pesach,
    // the readings for the third, fourth, and fifth days are moved ahead
    let cholHaMoedDay = e.cholHaMoedDay;
    if (isPesach && cholHaMoedDay >= 3) {
      if (dow == 0 && cholHaMoedDay == 4) {
        cholHaMoedDay = 3;
      } else if (dow == 1 && cholHaMoedDay == 5) {
        cholHaMoedDay = 4;
      }
    }
    return `${holiday} Chol ha-Moed Day ${cholHaMoedDay}`;
  } else if (e.chanukahDay) {
    if (isShabbat && isRoshChodesh) {
      return 'Shabbat Rosh Chodesh Chanukah';
    } else if (isRoshChodesh && e.chanukahDay == 7) {
      return `Chanukah Day 7 (on Rosh Chodesh)`;
    } else {
      return `Chanukah Day ${e.chanukahDay}`;
    }
  }

  if (isRoshChodesh && (desc == 'Shabbat HaChodesh' || desc == 'Shabbat Shekalim')) {
    return desc + ' (on Rosh Chodesh)';
  }

  if (desc == 'Shavuot') {
    return 'Shavuot I';
  } else if (il && desc == 'Shmini Atzeret') {
    return 'Simchat Torah';
  }

  if (isShabbat && 'Shabbat' != desc.substring(0, 7)) {
    const desc2 = desc + ' (on Shabbat)';
    if (festivals[desc2]) {
      return desc2;
    }
  }

  if (festivals[desc]) {
    return desc;
  }

  if (isShabbat) {
    if (isRoshChodesh) {
      if ((day === 30 && month === months.KISLEV) ||
          (day === 1 && month === months.TEVET)) {
        return 'Shabbat Rosh Chodesh Chanukah';
      }
      return 'Shabbat Rosh Chodesh';
    }
    const tommorow = hd.next().getDate();
    if (tommorow === 30 || tommorow === 1) {
      return 'Shabbat Machar Chodesh';
    }
  }

  if (desc === 'Rosh Hashana LaBehemot') {
    return undefined;
  }

  if (isRoshChodesh && desc !== 'Rosh Chodesh Tevet') {
    return desc;
  }

  if (desc === 'Tish\'a B\'Av (observed)') {
    return 'Tish\'a B\'Av';
  }

  return undefined;
}

const HOLIDAY_IGNORE_MASK = flags.DAF_YOMI | flags.OMER_COUNT | flags.SHABBAT_MEVARCHIM |
  flags.MOLAD | flags.USER_EVENT | flags.HEBREW_DATE;

/**
 * Looks up leyning for a given holiday. Returns some
 * of full kriyah aliyot, special Maftir, special Haftarah
 * @param {Event} e the Hebcal event associated with this leyning
 * @param {boolean} [il] true if Israel holiday scheme
 * @return {Leyning} map of aliyot
 */
export function getLeyningForHoliday(e, il=false) {
  if (typeof e !== 'object' || !(e instanceof Event)) {
    throw new TypeError(`Bad event argument: ${e}`);
  } else if (e.getFlags() & flags.PARSHA_HASHAVUA) {
    throw new TypeError(`Event should be a holiday: ${e.getDesc()}`);
  } else if (e.getFlags() & HOLIDAY_IGNORE_MASK) {
    return undefined;
  }
  const key = getLeyningKeyForEvent(e, il);
  const leyning = getLeyningForHolidayKey(key, e.cholHaMoedDay);
  return leyning;
}

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
 * Makes a summary of the leyning, like "Genesis 6:9-11:32"
 * @param {Object<string,Aliyah>} aliyot
 * @return {string}
 */
export function makeLeyningSummary(aliyot) {
  const parts = makeLeyningParts(aliyot);
  return makeSummaryFromParts(parts);
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
function makeHaftaraSummary(haft) {
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
 * @private
 * @param {Object.<string,string>} haft
 * @return {Object.<string,string>}
 */
function cloneHaftara(haft) {
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

/**
 * @private
 * @param {Aliyah|Aliyah[]} haft
 * @return {number}
 */
function calculateHaftaraNumV(haft) {
  return Array.isArray(haft) ? haft.reduce((prev, cur) => prev + cur.v, 0) : haft.v;
}

/**
 * Looks up leyning for a given holiday key. Key should be an
 * (untranslated) string used in holiday-readings.json. Returns some
 * of full kriyah aliyot, special Maftir, special Haftarah
 * @param {string} key name from `holiday-readings.json` to find
 * @param {number} [cholHaMoedDay]
 * @return {Leyning} map of aliyot
 */
export function getLeyningForHolidayKey(key, cholHaMoedDay) {
  if (typeof key !== 'string') {
    return undefined;
  }
  if (key.length > 14 && key.substring(0, 13) === 'Rosh Chodesh ') {
    key = 'Rosh Chodesh';
  }
  let src = festivals[key];
  if (typeof src === 'undefined') {
    return undefined;
  }
  if (src.alias) {
    src = festivals[src.key];
    if (typeof src === 'undefined') {
      throw new Error(`Leying key ${key} => ${src.key} not found`);
    }
  }
  const leyning = Object.create(null);
  if (src.fullkriyah) {
    leyning.fullkriyah = clone(src.fullkriyah);
    if (key === 'Sukkot Shabbat Chol ha-Moed' && cholHaMoedDay) {
      leyning.fullkriyah['M'] = leyning.fullkriyah[`M-day${cholHaMoedDay}`];
      for (let day = 1; day <= 5; day++) {
        delete leyning.fullkriyah[`M-day${day}`];
      }
    }
    if (typeof leyning.fullkriyah['1'] === 'object') {
      const parts = makeLeyningParts(leyning.fullkriyah);
      leyning.summary = makeSummaryFromParts(parts);
      if (parts.length > 1) {
        leyning.summaryParts = parts;
      }
    }
    Object.values(leyning.fullkriyah).map((aliyah) => calculateNumVerses(aliyah));
  }
  if (src.haft) {
    const haft = leyning.haft = cloneHaftara(src.haft);
    leyning.haftara = makeHaftaraSummary(haft);
    leyning.haftaraNumV = calculateHaftaraNumV(haft);
  }
  return leyning;
}

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
 * on doubled parshiot, read only the second Haftarah
 * except for Nitzavim-Vayelech
 * @private
 * @param {string[]} parsha
 * @return {string}
 */
function getHaftaraKey(parsha) {
  if (parsha.length == 1 || parsha[0] == 'Nitzavim') {
    return parsha[0];
  } else {
    return parsha[1];
  }
}

/**
 * @private
 * @param {Object<string,Aliyah>} aliyot
 */
function aliyotCombine67(aliyot) {
  const a6 = clone(aliyot['6']);
  const a7 = aliyot['7'];
  if (a6.k !== a7.k) {
    throw new Error('Impossible to combine aliyot 6 & 7: ' + JSON.stringify(aliyot));
  }
  delete aliyot['7'];
  aliyot['6'] = {
    k: a6.k,
    b: a6.b,
    e: a7.e,
  };
  if (a6.v && a7.v) {
    aliyot['6'].v = a6.v + a7.v;
  }
}

/**
 * @private
 * @param {Object<string,Aliyah>} aliyot
 * @param {Object<string,Aliyah>} special
 */
function mergeAliyotWithSpecial(aliyot, special) {
  if (special['7']) {
    aliyotCombine67(aliyot);
    aliyot['7'] = clone(special['7']);
    calculateNumVerses(aliyot['7']);
  }
  if (special['M']) {
    aliyot['M'] = clone(special['M']);
    calculateNumVerses(aliyot['M']);
  }
}

/**
 * @private
 * @param {Event} e
 * @param {string} key
 * @return {string}
 */
function getChanukahShabbatKey(e, key) {
  if (key == 'Shabbat Rosh Chodesh Chanukah') {
    return undefined;
  }
  if (e.chanukahDay) {
    return (e.chanukahDay == 8) ? 'Shabbat Chanukah II' : 'Shabbat Chanukah';
  }
  return undefined;
}

/**
 * @private
 * @param {Event} ev the Hebcal event associated with this leyning
 * @return {any}
 */
function getSpecialHaftara(ev) {
  if (!ev instanceof Event) {
    throw new TypeError(`Bad event argument: ${ev}`);
  } else if (ev.getFlags() != flags.PARSHA_HASHAVUA) {
    throw new TypeError(`Event must be parsha hashavua: ${ev.getDesc()}`);
  }
  const parsha = ev.parsha;
  const name = parshaToString(parsha); // untranslated
  const hd = ev.getDate();
  const day = hd.getDate();
  if (name === 'Pinchas') {
    const month = hd.getMonth();
    if (month > months.TAMUZ || (month === months.TAMUZ && day > 17)) {
      return {
        haft: {k: 'Jeremiah', b: '1:1', e: '2:3'},
        reason: 'Pinchas occurring after 17 Tammuz',
      };
    }
  } else if ((day === 30 || day === 1) && (name === 'Masei' || name === 'Matot-Masei')) {
    return {
      haft: [
        {k: 'Jeremiah', b: '2:4', e: '2:28'},
        {k: 'Jeremiah', b: '3:4', e: '3:4'},
        {k: 'Isaiah', b: '66:1', e: '66:1'},
        {k: 'Isaiah', b: '66:23', e: '66:23'},
      ],
      reason: `${name} on Shabbat Rosh Chodesh`,
    };
  }
  return false;
}

/**
 * Looks up regular leyning for a weekly parsha with no special readings
 * @param {string|string[]} parsha untranslated name like 'Pinchas' or ['Pinchas'] or ['Matot','Masei']
 * @return {Leyning} map of aliyot
 */
export function getLeyningForParsha(parsha) {
  const isParshaString = typeof parsha === 'string';
  if (!isParshaString &&
      (!Array.isArray(parsha) || (parsha.length !== 1 && parsha.length !== 2))) {
    throw new TypeError(`Bad parsha argument: ${parsha}`);
  }
  const name = isParshaString ? parsha : parshaToString(parsha);
  const raw = parshiyotObj[name];
  const fullkriyah = Object.create(null);
  const book = BOOK[raw.book];
  Object.keys(raw.fullkriyah).forEach((num) => {
    const src = raw.fullkriyah[num];
    const reading = {k: book, b: src.b, e: src.e};
    fullkriyah[num] = reading;
  });
  Object.values(fullkriyah).map((aliyah) => calculateNumVerses(aliyah));
  const parshaNameArray = isParshaString ? raw.combined ? [raw.p1, raw.p2] : [parsha] : parsha;
  const parts = makeLeyningParts(fullkriyah);
  const summary = makeSummaryFromParts(parts);
  /** @type {Leyning} */
  const result = {
    summary,
    fullkriyah: fullkriyah,
  };
  if (parts.length > 1) {
    result.summaryParts = parts;
  }
  const hkey = getHaftaraKey(parshaNameArray);
  const haft0 = parshiyotObj[hkey].haft;
  if (haft0) {
    const haft = result.haft = cloneHaftara(haft0);
    result.haftara = makeHaftaraSummary(haft);
    result.haftaraNumV = calculateHaftaraNumV(haft);
  }
  if (raw.seph) {
    const seph = result.seph = cloneHaftara(raw.seph);
    result.sephardic = makeHaftaraSummary(seph);
    result.sephardicNumV = calculateHaftaraNumV(seph);
  }
  const weekdaySrc = raw.weekday || parshiyotObj[parshaNameArray[0]].weekday;
  if (weekdaySrc) {
    const weekday = result.weekday = Object.create(null);
    ['1', '2', '3'].forEach((num) => {
      const src = weekdaySrc[num];
      const aliyah = {k: book, b: src.b, e: src.e};
      calculateNumVerses(aliyah);
      weekday[num] = aliyah;
    });
  }
  return result;
}

/**
 * Looks up leyning for a regular Shabbat parsha.
 * @param {Event} ev the Hebcal event associated with this leyning
 * @param {boolean} [il] in Israel
 * @return {Leyning} map of aliyot
 */
export function getLeyningForParshaHaShavua(ev, il=false) {
  if (!ev instanceof Event) {
    throw new TypeError(`Bad event argument: ${ev}`);
  } else if (ev.getFlags() != flags.PARSHA_HASHAVUA) {
    throw new TypeError(`Event must be parsha hashavua: ${ev.getDesc()}`);
  }
  // first, collect the default aliyot and haftara
  const parsha = ev.parsha;
  const result = getLeyningForParsha(parsha);
  const reason = Object.create(null);
  const hd = ev.getDate();
  // Now, check for special maftir or haftara on same date
  const specialHaftara = specialReadings(hd, il, result.fullkriyah, reason);
  let updateHaftaraSummary = false;
  if (specialHaftara) {
    result.haft = cloneHaftara(specialHaftara);
    updateHaftaraSummary = true;
  }
  if (reason['7'] || reason['M']) {
    const parts = makeLeyningParts(result.fullkriyah);
    result.summary = makeSummaryFromParts(parts);
    result.summaryParts = parts;
  }
  const specialHaftara2 = getSpecialHaftara(ev);
  if (specialHaftara2) {
    result.haft = cloneHaftara(specialHaftara2.haft);
    updateHaftaraSummary = true;
    reason.haftara = specialHaftara2.reason;
  }
  if (Object.keys(reason).length) {
    result.reason = reason;
  }
  if (updateHaftaraSummary) {
    const haft = result.haft;
    result.haftara = makeHaftaraSummary(haft);
    result.haftaraNumV = calculateHaftaraNumV(haft);
  }
  return result;
}

/**
 * @private
 * @param {HDate} hd
 * @param {boolean} il
 * @param {Object<string,Aliyah>} aliyot
 * @param {Object<string,string>} reason
 * @return {string}
 */
export function specialReadings(hd, il, aliyot, reason) {
  let haft;
  let specialHaft = false;

  // eslint-disable-next-line require-jsdoc
  function handleSpecial(special, key) {
    if (special.haft && !specialHaft) {
      haft = cloneHaftara(special.haft);
      reason.haftara = key;
      specialHaft = true;
    }
    if (special.fullkriyah) {
      mergeAliyotWithSpecial(aliyot, special.fullkriyah);
      Object.keys(special.fullkriyah).map((k) => reason[k] = key);
    }
  }

  const events0 = HebrewCalendar.getHolidaysOnDate(hd, il) || [];
  const events = events0.filter((ev) => !(ev.getFlags() & flags.ROSH_CHODESH));
  events.forEach((ev) => {
    const key = getLeyningKeyForEvent(ev, il);
    //            console.log(hd.greg().toLocaleDateString(), name, ev.getDesc(), key);
    const special = festivals[key];
    if (special) {
      const shabbatChanukah = getChanukahShabbatKey(ev, key);
      if (shabbatChanukah) {
        // only for Shabbat Chanukah I or Shabbat Chanukah II. Note
        // this section doesn't apply to Shabbat Rosh Chodesh Chanukah; that
        // case gets handled below with the mergeAliyotWithSpecial() logic
        haft = cloneHaftara(festivals[shabbatChanukah].haft);
        specialHaft = true;
        reason.haftara = shabbatChanukah;
        // Aliyot 1-3 from regular daily reading becomes Maftir
        const maftir = aliyot['M'] = clone(special.fullkriyah['1']);
        maftir.e = special.fullkriyah['3'].e;
        calculateNumVerses(maftir);
        reason.M = key;
      } else {
        handleSpecial(special, key);
      }
    }
  });
  if (!haft) {
    const day = hd.getDate();
    if (day === 30 || day === 1) {
      const key = 'Shabbat Rosh Chodesh';
      const special = festivals[key];
      handleSpecial(special, key);
    } else {
      const tommorow = hd.next().getDate();
      if (tommorow === 30 || tommorow === 1) {
        const key = 'Shabbat Machar Chodesh';
        const special = festivals[key];
        handleSpecial(special, key);
      }
    }
  }
  return haft;
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
