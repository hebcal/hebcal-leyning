import {HDate, HebrewCalendar, months, flags, Event, ParshaEvent, Locale} from '@hebcal/core';
import {BOOK, calculateNumVerses, clone, cloneHaftara,
  parshaToString,
  makeHaftaraSummary, makeSummaryFromParts, calculateHaftaraNumV} from './common';
import {lookupFestival} from './festival';
import parshiyotObj from './aliyot.json';
import {specialReadings} from './specialReadings';
import {getLeyningKeyForEvent, HOLIDAY_IGNORE_MASK} from './getLeyningKeyForEvent';

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
 * Name of the parsha hashavua or holiday
 * @typedef {Object} LeyningNames
 * @property {string} en English
 * @property {string} he Hebrew (with nikud)
 */

/**
 * Leyning for a parsha hashavua or holiday
 * @typedef {Object} Leyning
 * @property {LeyningNames} name
 * @property {string[]} [parsha] - An array of either 1 (regular) or 2 (doubled parsha).
 *    `undefined` for holiday readings
 * @property {num} [parshaNum] - 1 for Bereshit, 2 for Noach, etc. `undefined` for holiday readings
 * @property {string} summary - Such as `Genesis 1:1 - 6:8`
 * @property {Aliyah|Aliyah[]} haft - Haftarah object(s)
 * @property {string} haftara - Haftarah, such as `Isaiah 42:5 – 43:11`
 * @property {number} [haftaraNumV] - Number of verses in the Haftarah
 * @property {Aliyah|Aliyah[]} [seph] - Haftarah object(s) for Sephardim
 * @property {string} [sephardic] - Haftarah for Sephardim, such as `Isaiah 42:5 - 42:21`
 * @property {number} [sephardicNumV] - Number of verses in the Haftarah for Sephardim
 * @property {Object<string,Aliyah>} fullkriyah - Map of aliyot `1` through `7` plus `M` for maftir
 * @property {Object<string,Aliyah>} [weekday] - Optional map of weekday Torah Readings
 *    aliyot `1` through `3` for Monday and Thursday
 * @property {Object<string,string>} [reason] - Explanations for special readings,
 *    keyed by aliyah number, `M` for maftir or `haftara` for Haftarah
 */

/**
 * Looks up leyning for a given holiday. Returns some
 * of full kriyah aliyot, special Maftir, special Haftarah
 * @param {Event} ev the Hebcal event associated with this leyning
 * @param {boolean} [il] true if Israel holiday scheme
 * @return {Leyning} map of aliyot
 */
export function getLeyningForHoliday(ev, il=false) {
  if (typeof ev !== 'object' || !(ev instanceof Event)) {
    throw new TypeError(`Bad event argument: ${ev}`);
  } else if (ev.getFlags() & flags.PARSHA_HASHAVUA) {
    throw new TypeError(`Event should be a holiday: ${ev.getDesc()}`);
  } else if (ev.getFlags() & HOLIDAY_IGNORE_MASK) {
    return undefined;
  }
  const key = getLeyningKeyForEvent(ev, il);
  const leyning = getLeyningForHolidayKey(key, ev.cholHaMoedDay);
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
  const key2 = (key.length > 14 && key.substring(0, 13) === 'Rosh Chodesh ') ? 'Rosh Chodesh' : key;
  const src = lookupFestival(key2);
  if (typeof src === 'undefined') {
    return undefined;
  }
  const leyning = {
    name: {
      en: key,
      he: Locale.lookupTranslation(key, 'he'),
    },
  };
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
  const fullkriyah = {};
  const book = BOOK[raw.book];
  Object.keys(raw.fullkriyah).forEach((num) => {
    const src = raw.fullkriyah[num];
    const reading = {k: book, b: src[0], e: src[1]};
    fullkriyah[num] = reading;
  });
  Object.values(fullkriyah).map((aliyah) => calculateNumVerses(aliyah));
  const parshaNameArray = isParshaString ? raw.combined ? [raw.p1, raw.p2] : [parsha] : parsha;
  const parts = makeLeyningParts(fullkriyah);
  const summary = makeSummaryFromParts(parts);
  /** @type {Leyning} */
  const result = {
    name: {
      en: name,
      he: parshaNameArray.map((s) => Locale.lookupTranslation(s, 'he')).join('־'),
    },
    parsha: parshaNameArray,
    parshaNum: raw.num,
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
    const weekday = result.weekday = {};
    ['1', '2', '3'].forEach((num) => {
      const src = weekdaySrc[num];
      const aliyah = {k: book, b: src[0], e: src[1]};
      calculateNumVerses(aliyah);
      weekday[num] = aliyah;
    });
  }
  return result;
}

/**
 * Looks up leyning for a regular Shabbat parsha, including any special
 * maftir or Haftara.
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
  const reason = {};
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
  const reasons = Object.keys(reason);
  if (reasons.length !== 0) {
    result.reason = reason;
    reasons.forEach((num) => {
      if (num === 'haftara') {
        result.haft.reason = reason[num];
      } else {
        const aliyah = result.fullkriyah[num];
        if (typeof aliyah === 'object') {
          aliyah.reason = reason[num];
        }
      }
    });
  }
  if (updateHaftaraSummary) {
    const haft = result.haft;
    result.haftara = makeHaftaraSummary(haft);
    result.haftaraNumV = calculateHaftaraNumV(haft);
  }
  return result;
}

/**
 * Looks up leyning for a regular Shabbat, Monday/Thursday weekday or holiday.
 *
 * If `hdate` coincides with a holiday that has Torah reading, returns the
 * reading for that day (see {@link getLeyningForHoliday})
 *
 * Otherwise, if `hdate` is a Saturday, returns {@link getLeyningForParshaHaShavua}
 *
 * Otherwise, if `hdate` is a Monday or Thursday, returns {@link Leyning} for the
 * Parashat haShavua, containing only the `weekday` aliyot (no `fullkriyah`).
 *
 * Otherwise, returns `undefined`.
 *
 * @param {HDate} hdate Hebrew Date
 * @param {boolean} il in Israel
 * @return {Leyning} map of aliyot
 */
export function getLeyningOnDate(hdate, il) {
  const dow = hdate.getDay();
  const hyear = hdate.getFullYear();
  const sedra = HebrewCalendar.getSedra(hyear, il);
  const parsha = sedra.lookup(hdate);
  if (dow === 6 && !parsha.chag) {
    const parshaEvent = new ParshaEvent(hdate, parsha.parsha, il);
    return getLeyningForParshaHaShavua(parshaEvent, il);
  }
  const events = HebrewCalendar.getHolidaysOnDate(hdate, il);
  if (events) {
    const reading = getLeyningForHoliday(events[0], il);
    if (reading) {
      return reading;
    } else if (dow !== 1 && dow !== 4) {
      return undefined; // today is a non-reading holiday
    }
    // otherwise continue below for Mon/Thu
  }
  if (dow === 1 || dow === 4) {
    const saturday = hdate.onOrAfter(6);
    const parsha2 = findParshaHaShavua(saturday);
    const reading = getLeyningForParsha(parsha2.parsha);
    const result = {
      name: reading.name,
      parsha: reading.parsha,
      parshaNum: reading.parshaNum,
      weekday: reading.weekday,
    };
    return result;
  }
  // no reading today: it's not Shabbat, Mon/Thu, or a Torah-reading holiday
  return undefined;
}

/**
 * @private
 * @param {HDate} saturday
 * @param {boolean} il
 * @return {Leyning}
 */
function findParshaHaShavua(saturday, il) {
  const hyear = saturday.getFullYear();
  const sedra = HebrewCalendar.getSedra(hyear, il);
  const parsha = sedra.lookup(saturday);
  if (!parsha.chag) {
    return parsha;
  }
  // Search for next regular parsha, which could even spill into next year
  const endOfYear = new HDate(1, months.TISHREI, hyear + 1).abs() - 1;
  const endAbs = endOfYear + 30;
  for (let sat2 = saturday.abs() + 7; sat2 <= endAbs; sat2 += 7) {
    const sedra2 = sat2 > endOfYear ? HebrewCalendar.getSedra(hyear + 1, il) : sedra;
    const parsha2 = sedra2.lookup(sat2);
    if (!parsha2.chag) {
      return parsha2;
    }
  }
  /* NOTREACHED */
  return null;
}
