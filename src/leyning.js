import {HebrewCalendar, months, flags, Event} from '@hebcal/core';
import {shallowCopy} from './common';
import festivals from './holiday-readings.json';
import parshiyotObj from './aliyot.json';

/**
 * Leyning for a parsha hashavua or holiday
 * @typedef {Object} Leyning
 * @property {string} summary
 * @property {string} haftara - Haftarah
 * @property {string} sephardic - Haftarah for Sephardic
 * @property {Object<string,Aliyah>} fullkriyah
 * @property {Object} [reason]
 */

/**
 * Based on the event date, type and title, finds the relevant leyning key
 * @param {Event} e event
 * @param {boolean} [il] true if Israel holiday scheme
 * @return {string} key to look up in holiday-reading.json
 */
export function getLeyningKeyForEvent(e, il=false) {
  const hd = e.getDate();
  const day = hd.getDate();
  const desc = e.getDesc();
  const dow = hd.abs() % 7;
  const isShabbat = (dow == 6);
  const isRoshChodesh = (day == 1 || day == 30);

  if (day == 1 && hd.getMonth() == months.TISHREI) {
    return isShabbat ? 'Rosh Hashana I (on Shabbat)' : 'Rosh Hashana I';
  } else if (e && e.cholHaMoedDay) {
    // Sukkot or Pesach
    const holiday = desc.substring(0, desc.indexOf(' '));
    if (isShabbat) {
      return holiday + ' Shabbat Chol ha-Moed';
    } else if (desc == 'Sukkot VII (Hoshana Raba)') {
      return 'Sukkot Final Day (Hoshana Raba)';
    }
    // If Shabbat falls on the third day of Chol ha-Moed Pesach,
    // the readings for the third, fourth, and fifth days are moved ahead
    let cholHaMoedDay = e.cholHaMoedDay;
    if (holiday == 'Pesach' && cholHaMoedDay >= 3) {
      if (dow == 0 && cholHaMoedDay == 4) {
        cholHaMoedDay = 3;
      } else if (dow == 1 && cholHaMoedDay == 5) {
        cholHaMoedDay = 4;
      }
    }
    return `${holiday} Chol ha-Moed Day ${cholHaMoedDay}`;
  } else if (e && e.chanukahDay) {
    if (isShabbat && isRoshChodesh) {
      return 'Shabbat Rosh Chodesh Chanukah';
    } else if (isRoshChodesh && e.chanukahDay == 7) {
      return `Chanukah (Day 7 on Rosh Chodesh)`;
    } else {
      return `Chanukah (Day ${e.chanukahDay})`;
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

  if (isShabbat && isRoshChodesh) {
    return 'Shabbat Rosh Chodesh';
  } else if (isShabbat && (hd.next().getDate() == 30 || hd.next().getDate() == 1)) {
    return 'Shabbat Machar Chodesh';
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
  if (!e instanceof Event) {
    throw new TypeError(`Bad event argument: ${e}`);
  } else if (e.getFlags() & flags.PARSHA_HASHAVUA) {
    throw new TypeError(`Event should be a holiday: ${e.getDesc()}`);
  } else if (e.getFlags() & HOLIDAY_IGNORE_MASK) {
    return undefined;
  }
  const key = getLeyningKeyForEvent(e, il);
  const leyning = getLeyningForHolidayKey(key);
  if (key === 'Sukkot Shabbat Chol ha-Moed') {
    leyning.fullkriyah['M'] = leyning.fullkriyah[`M-day${e.cholHaMoedDay}`];
    for (let day = 1; day <= 5; day++) {
      delete leyning.fullkriyah[`M-day${day}`];
    }
  }
  return leyning;
}

/**
 * Looks up leyning for a given holiday key. Key should be an
 * (untranslated) string used in holiday-readings.json. Returns some
 * of full kriyah aliyot, special Maftir, special Haftarah
 * @param {string} key name from `holiday-readings.json` to find
 * @return {Leyning} map of aliyot
 */
export function getLeyningForHolidayKey(key) {
  const src = festivals[key];
  if (typeof src === 'undefined') {
    return src;
  }
  const leyning = Object.create(null);
  if (src.fullkriyah) {
    if (typeof src.fullkriyah['1'] === 'object') {
      const beginAliyah = src.fullkriyah['1'];
      let endChapVerse = beginAliyah.e.split(':').map((x) => +x);
      const aliyot2plus = Object.keys(src.fullkriyah).filter((x) => parseInt(x, 10) > 1).sort();
      aliyot2plus.forEach((num) => {
        const aliyah = src.fullkriyah[num];
        const chapVerse = aliyah.e.split(':').map((x) => +x);
        if (aliyah.k === beginAliyah.k && (chapVerse[0]*100 + chapVerse[1]) > (endChapVerse[0]*100 + endChapVerse[1])) {
          endChapVerse = chapVerse;
        }
      });
      leyning.summary = `${beginAliyah.k} ${beginAliyah.b}-${endChapVerse[0]}:${endChapVerse[1]}`;
      if (typeof src.fullkriyah['M'] === 'object') {
        leyning.summary += '; ';
        const maftir = src.fullkriyah['M'];
        if (maftir.k !== beginAliyah.k) {
          leyning.summary += maftir.k + ' ';
        }
        leyning.summary += `${maftir.b}-${maftir.e}`;
      }
    }
    leyning.fullkriyah = shallowCopy(Object.create(null), src.fullkriyah);
  }
  if (src.haftara) {
    leyning.haftara = src.haftara;
  }
  return leyning;
}

/**
 * Formats parsha as a string
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
  const a6 = shallowCopy(Object.create(null), aliyot['6']);
  const a7 = shallowCopy(Object.create(null), aliyot['7']);
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
    aliyot['7'] = shallowCopy(Object.create(null), special['7']);
  }
  if (special['M']) {
    aliyot['M'] = shallowCopy(Object.create(null), special['M']);
  }
}

/**
 * @param {Event} e
 * @param {string} key
 * @return {string}
 */
function getChanukahShabbatKey(e, key) {
  if (key == 'Shabbat Rosh Chodesh Chanukah') {
    return undefined;
  }
  if (e && e.chanukahDay) {
    return (e.chanukahDay == 8) ? 'Shabbat Chanukah II' : 'Shabbat Chanukah';
  }
  return undefined;
}

/**
 * Filters out Rosh Chodesh and events that don't occur in this location
 * @param {HDate} hd Hebrew date
 * @param {boolean} il in Israel
 * @return {Event[]}
 */
function getHolidayEvents(hd, il) {
  const events = HebrewCalendar.getHolidaysOnDate(hd) || [];
  return events.filter((e) => {
    if ((e.getFlags() & flags.ROSH_CHODESH) && events.length > 1) {
      return false;
    }
    return (il && e.observedInIsrael()) || (!il && e.observedInDiaspora());
  });
}

/**
 * Looks up leyning for a regular Shabbat parsha.
 * @param {Event} e the Hebcal event associated with this leyning
 * @param {boolean} [il] in Israel
 * @return {Leyning} map of aliyot
 */
export function getLeyningForParshaHaShavua(e, il=false) {
  if (!e instanceof Event) {
    throw new TypeError(`Bad event argument: ${e}`);
  } else if (e.getFlags() != flags.PARSHA_HASHAVUA) {
    throw new TypeError(`Event must be parsha hashavua: ${e.getDesc()}`);
  }
  // first, collect the default aliyot and haftara
  const parsha = e.parsha;
  const name = parshaToString(parsha); // untranslated
  const raw = parshiyotObj[name];
  let haftara = parshiyotObj[getHaftaraKey(parsha)].haftara;
  const fullkriyah = Object.create(null);
  Object.keys(raw.fullkriyah).forEach((num) => {
    const src = raw.fullkriyah[num];
    const reading = {k: raw.book, b: src.b, e: src.e};
    if (src.v) {
      reading.v = src.v;
    }
    fullkriyah[num] = reading;
  });
  const reason = Object.create(null);
  const hd = e.getDate();
  if (name == 'Pinchas') {
    const month = hd.getMonth();
    if (month > months.TAMUZ || (month == months.TAMUZ && hd.getDate() > 17)) {
      haftara = 'Jeremiah 1:1 - 2:3';
      reason.haftara = 'Pinchas occurring after 17 Tammuz';
    }
  }
  // Now, check for special maftir or haftara on same date
  const specialHaftara = specialReadings(hd, il, fullkriyah, reason);
  if (specialHaftara) {
    haftara = specialHaftara;
  }
  const result = {
    summary: `${raw.book} ${raw.verses}`,
    fullkriyah: fullkriyah,
    haftara: haftara,
  };
  if (raw.sephardic) {
    result.sephardic = raw.sephardic;
  }
  if (Object.keys(reason).length) {
    result.reason = reason;
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
  const events = getHolidayEvents(hd, il);
  let haftara;
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
        haftara = festivals[shabbatChanukah].haftara;
        reason.haftara = shabbatChanukah;
        // Aliyot 1-3 from regular daily reading becomes Maftir
        aliyot['M'] = shallowCopy(Object.create(null), special.fullkriyah['1']);
        aliyot['M'].e = special.fullkriyah['3'].e;
        reason.M = key;
      } else {
        if (special.haftara && !reason.haftara) {
          haftara = special.haftara;
          reason.haftara = key;
        }
        if (special.fullkriyah) {
          mergeAliyotWithSpecial(aliyot, special.fullkriyah);
          Object.keys(special.fullkriyah).map((k) => reason[k] = key);
        }
      }
    }
  });
  return haftara;
}

/**
 * Formats an aliyah object like "Numbers 28:9 - 28:15"
 * @param {Aliyah} a aliyah
 * @return {string}
 */
export function formatAliyahWithBook(a) {
  return `${a.k} ${a.b} - ${a.e}`;
}
