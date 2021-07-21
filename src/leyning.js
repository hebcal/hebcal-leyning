import {HebrewCalendar, months, flags, Event} from '@hebcal/core';
import {BOOK, calculateNumVerses, calculateHaftarahNumVerses, clone} from './common';
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
 * @private
 * @param {string} a
 * @param {string} b
 * @return {boolean}
 */
function isChapVerseLater(a, b) {
  const cv1 = a.split(':').map((x) => +x);
  const cv2 = b.split(':').map((x) => +x);
  return (cv1[0]*100 + cv1[1]) > (cv2[0]*100 + cv2[1]);
}

/**
 * @param {Object<string,Aliyah>} aliyot
 * @return {string}
 */
export function makeLeyningSummary(aliyot) {
  const parts = [];
  let book = null;
  let begin;
  let end;
  let chap;
  Object.keys(aliyot).forEach((num) => {
    const aliyah = aliyot[num];
    const cv = aliyah.e.split(':').map((x) => +x);
    const sameOrNextChap = cv[0] === chap || cv[0] === chap + 1;
    if (aliyah.k !== book || !sameOrNextChap) {
      if (book !== null) {
        parts.push({k: book, b: begin, e: end});
      }
      book = aliyah.k;
      begin = aliyah.b;
      end = aliyah.e;
      chap = cv[0];
    }
    if (aliyah.k === book && isChapVerseLater(aliyah.e, end)) {
      end = aliyah.e;
      chap = cv[0];
    }
  });
  parts.push({k: book, b: begin, e: end});
  let prev = parts.shift();
  let summary = formatAliyahShort(prev, true);
  parts.forEach((part) => {
    if (part.k === prev.k) {
      summary += ', ';
    } else {
      summary += `; ${part.k} `;
    }
    summary += formatAliyahShort(part, false);
    prev = part;
  });
  return summary;
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
      leyning.summary = makeLeyningSummary(src.fullkriyah);
    }
    leyning.fullkriyah = clone(src.fullkriyah);
    Object.values(leyning.fullkriyah).map((aliyah) => calculateNumVerses(aliyah));
  }
  if (src.haftara) {
    leyning.haftara = src.haftara;
    const numv = calculateHaftarahNumVerses(leyning.haftara);
    if (numv) {
      leyning.haftaraNumV = numv;
    }
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
        haftara: 'Jeremiah 1:1 - 2:3',
        reason: 'Pinchas occurring after 17 Tammuz',
      };
    }
  } else if ((day === 30 || day === 1) && (name === 'Masei' || name === 'Matot-Masei')) {
    return {
      haftara: 'Jeremiah 2:4 - 2:28; Jeremiah 3:4; Isaiah 66:1; Isaiah 66:23',
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
  const hkey = getHaftaraKey(parshaNameArray);
  const haftara = parshiyotObj[hkey].haftara;
  const result = {
    summary: makeLeyningSummary(fullkriyah),
    fullkriyah: fullkriyah,
    haftara: haftara,
  };
  if (haftara) {
    const numv = calculateHaftarahNumVerses(haftara);
    if (numv) {
      result.haftaraNumV = numv;
    }
  }
  if (raw.sephardic) {
    result.sephardic = raw.sephardic;
    const numv = calculateHaftarahNumVerses(raw.sephardic);
    if (numv) {
      result.sephardicNumV = numv;
    }
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
  const origHaftara = result.haftara;
  const specialHaftara = specialReadings(hd, il, result.fullkriyah, reason);
  if (specialHaftara) {
    result.haftara = specialHaftara;
  }
  if (reason['7'] || reason['M']) {
    result.summary = makeLeyningSummary(result.fullkriyah);
  }
  const specialHaftara2 = getSpecialHaftara(ev);
  if (specialHaftara2) {
    result.haftara = specialHaftara2.haftara;
    reason.haftara = specialHaftara2.reason;
  }
  if (origHaftara !== result.haftara) {
    const numv = calculateHaftarahNumVerses(result.haftara);
    if (numv) {
      result.haftaraNumV = numv;
    }
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
        const maftir = aliyot['M'] = clone(special.fullkriyah['1']);
        maftir.e = special.fullkriyah['3'].e;
        calculateNumVerses(maftir);
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

/**
 * Formats an aliyah object like "Numbers 28:9-15"
 * @param {Aliyah} aliyah
 * @param {boolean} showBook
 * @return {string}
 */
export function formatAliyahShort(aliyah, showBook) {
  const cv1 = aliyah.b.split(':');
  const cv2 = aliyah.e.split(':');
  const end = cv1[0] === cv2[0] ? cv2[1] : aliyah.e;
  const prefix = showBook ? aliyah.k + ' ' : '';
  return `${prefix}${aliyah.b}-${end}`;
}
