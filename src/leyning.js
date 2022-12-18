import {HDate, HebrewCalendar, months, flags, ParshaEvent, Locale} from '@hebcal/core';
import {BOOK, calculateNumVerses, clone, cloneHaftara,
  parshaToString, sumVerses} from './common';
import {makeSummaryFromParts} from './summary';
import {lookupFestival} from './festival';
import parshiyotObj from './aliyot.json';
import {specialReadings2} from './specialReadings';
import {getLeyningKeyForEvent, HOLIDAY_IGNORE_MASK} from './getLeyningKeyForEvent';
import {makeLeyningParts} from './summary';

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
 * @property {number} [parshaNum] - 1 for Bereshit, 2 for Noach, etc. `undefined` for holiday readings
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
  if (typeof ev !== 'object' || typeof ev.getFlags !== 'function') {
    throw new TypeError(`Bad event argument: ${ev}`);
  } else if (typeof ev.eventTime !== 'undefined') {
    return undefined;
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
  const src = lookupFestival(key);
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
    leyning.haftara = makeSummaryFromParts(haft);
    leyning.haftaraNumV = sumVerses(haft);
  }
  if (src.seph) {
    const seph = leyning.seph = cloneHaftara(src.seph);
    leyning.sephardic = makeSummaryFromParts(seph);
    leyning.sephardicNumV = sumVerses(seph);
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
 * Looks up regular leyning for a weekly parsha with no special readings
 * @private
 * @param {string|string[]} parsha untranslated name like 'Pinchas' or ['Pinchas'] or ['Matot','Masei']
 * @return {Leyning} map of aliyot
 */
function getLeyningForParshaShabbatOnly(parsha) {
  const raw = lookupParsha(parsha);
  const fullkriyah = {};
  const book = BOOK[raw.book];
  Object.keys(raw.fullkriyah).forEach((num) => {
    const src = raw.fullkriyah[num];
    const reading = {k: book, b: src[0], e: src[1]};
    fullkriyah[num] = reading;
  });
  Object.values(fullkriyah).map((aliyah) => calculateNumVerses(aliyah));
  const name = parshaToString(parsha);
  const parshaNameArray = raw.combined ? [raw.p1, raw.p2] : [name];
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
    result.haftara = makeSummaryFromParts(haft);
    result.haftaraNumV = sumVerses(haft);
  }
  if (raw.seph) {
    const seph = result.seph = cloneHaftara(raw.seph);
    result.sephardic = makeSummaryFromParts(seph);
    result.sephardicNumV = sumVerses(seph);
  }
  return result;
}

/**
 * Looks up Monday/Thursday aliyot for a regular parsha
 * @param {string|string[]} parsha untranslated name like 'Pinchas' or ['Pinchas'] or ['Matot','Masei']
 * @return {Object<string,Aliyah>} map of aliyot
 */
export function getWeekdayReading(parsha) {
  const raw = lookupParsha(parsha);
  const parshaMeta = raw.combined ? lookupParsha(raw.p1) : raw;
  const aliyot = parshaMeta.weekday;
  if (!aliyot) {
    throw new Error(`Parsha missing weekday: ${parsha}`);
  }
  const book = BOOK[raw.book];
  const weekday = {};
  for (let i = 1; i <= 3; i++) {
    const num = '' + i;
    const src = aliyot[num];
    const aliyah = {k: book, b: src[0], e: src[1]};
    calculateNumVerses(aliyah);
    weekday[num] = aliyah;
  }
  return weekday;
}

/**
 * Looks up regular leyning for a weekly parsha with no special readings
 * @param {string|string[]} parsha untranslated name like 'Pinchas' or ['Pinchas'] or ['Matot','Masei']
 * @return {Leyning} map of aliyot
 */
export function getLeyningForParsha(parsha) {
  const result = getLeyningForParshaShabbatOnly(parsha);
  result.weekday = getWeekdayReading(parsha);
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
  if (typeof ev !== 'object' || typeof ev.getFlags !== 'function') {
    throw new TypeError(`Bad event argument: ${ev}`);
  } else if (ev.getFlags() != flags.PARSHA_HASHAVUA) {
    throw new TypeError(`Event must be parsha hashavua: ${ev.getDesc()}`);
  }
  // first, collect the default aliyot and haftara
  const parsha = ev.parsha;
  const result = getLeyningForParshaShabbatOnly(parsha);
  const hd = ev.getDate();
  // Now, check for special maftir or haftara on same date
  const special = specialReadings2(parsha, hd, il, result.fullkriyah);
  const reason = special.reason;
  if (special.haft) {
    const haft = result.haft = cloneHaftara(special.haft);
    result.haftara = makeSummaryFromParts(haft);
    result.haftaraNumV = sumVerses(haft);
    if (special.seph) {
      const seph = result.seph = cloneHaftara(special.seph);
      result.sephardic = makeSummaryFromParts(seph);
      result.sephardicNumV = sumVerses(seph);
    }
  }
  if (reason['7'] || reason['M']) {
    result.fullkriyah = special.aliyot;
    const parts = makeLeyningParts(result.fullkriyah);
    result.summary = makeSummaryFromParts(parts);
    result.summaryParts = parts;
  }
  const reasons = Object.keys(reason);
  if (reasons.length !== 0) {
    result.reason = reason;
    reasons.forEach((num) => {
      if (num === 'haftara' || num === 'sephardic') {
        const haftObj = result[num === 'haftara' ? 'haft' : 'seph'];
        const hafts = Array.isArray(haftObj) ? haftObj : [haftObj];
        hafts.forEach((haft) => haft.reason = reason[num]);
      } else {
        const aliyah = result.fullkriyah[num];
        if (typeof aliyah === 'object') {
          aliyah.reason = reason[num];
        }
      }
    });
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
  const events = HebrewCalendar.getHolidaysOnDate(hdate, il) || [];
  for (let i = 0; i < events.length; i++) {
    const reading = getLeyningForHoliday(events[i], il);
    if (reading) {
      return reading;
    }
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


/**
 * Parsha metadata
 * @typedef {Object} ParshaMeta
 * @property {number} num - 1 for Bereshit, 2 for Noach, etc. `undefined` for holiday readings
 * @property {string} hebrew - parsha name in Hebrew with niqud
 * @property {number} book - 1 for Genesis, 2 for Exodus, 5 for Deuteronomy
 * @property {Aliyah|Aliyah[]} haft - Haftarah object(s)
 * @property {Aliyah|Aliyah[]} [seph] - Haftarah object(s) for Sephardim
 * @property {Object<string,string[]>} fullkriyah - Map of aliyot `1` through `7` plus `M` for maftir
 * @property {Object<string,string[]>} weekday - Map of weekday Torah Readings
 *    aliyot `1` through `3` for Monday and Thursday
 */

/**
 * Returns the parsha metadata
 * @param {string|string[]} parsha untranslated name like 'Pinchas' or ['Pinchas'] or ['Matot','Masei']
 * @return {ParshaMeta}
 */
export function lookupParsha(parsha) {
  const name = parshaToString(parsha);
  const raw = parshiyotObj[name];
  if (typeof raw !== 'object') {
    throw new TypeError(`Bad parsha argument: ${parsha}`);
  }
  return raw;
}
