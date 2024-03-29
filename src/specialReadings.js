import {HebrewCalendar, flags, months} from '@hebcal/core';
import {calculateNumVerses, clone, cloneHaftara, parshaToString} from './common.js';
import {lookupFestival} from './festival.js';
import {getLeyningKeyForEvent} from './getLeyningKeyForEvent.js';

/**
 * Leyning for a parsha hashavua or holiday
 * @typedef {Object} SpecialReading
 * @property {Object<string,Aliyah>} aliyot - Map of aliyot `1` through `7` plus `M` for maftir
 * @property {Object<string,string>} [reason] - Explanations for special readings,
 *    keyed by aliyah number, `M` for maftir or `haftara` for Haftarah
 * @property {Aliyah|Aliyah[]} haft - Haftarah object(s)
 * @property {Aliyah|Aliyah[]} seph - Haftarah object(s)
 */

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
 * Determines if the regular parashat haShavua coincides with an event that requires
 * a special maftir or Haftara (for example Shabbat HaGadol, Shabbat Chanukah, Rosh
 * Chodesh or Machar Chodesh, etc.).
 *
 * This function does not modify `aliyot`. Instead, it returns a deep copy
 * with `aliyot['M']` replaced and sets `reason.M`
 * (and in some cases the 6th and 7th aliyah, setting `reason['7']`).
 *
 * If a special Haftarah applies, the result will have a `haft` property
 * pointing to Haftarah object and sets `reason.haftara`.
 * @param {string[]} parsha
 * @param {HDate} hd
 * @param {boolean} il
 * @param {Object<string,Aliyah>} aliyot
 * @return {SpecialReading}
 */
export function specialReadings2(parsha, hd, il, aliyot) {
  let haft;
  let seph;
  let specialHaft = false;
  const reason = {};

  // eslint-disable-next-line require-jsdoc
  function handleSpecial(key) {
    const special = lookupFestival(key);
    if (!special) {
      return;
    }
    if (typeof special.il === 'boolean' && il !== special.il) {
      return;
    }
    if (special.haft && !specialHaft) {
      haft = cloneHaftara(special.haft);
      reason.haftara = key;
      specialHaft = true;
      if (special.seph) {
        seph = cloneHaftara(special.seph);
        reason.sephardic = key;
      }
    }
    if (special.fullkriyah) {
      const aliyotMap = clone(aliyot);
      mergeAliyotWithSpecial(aliyotMap, special.fullkriyah);
      for (const num of Object.keys(special.fullkriyah)) {
        reason[num] = key;
      }
      aliyot = aliyotMap;
    }
  }

  const parshaName = parshaToString(parsha);
  const events0 = HebrewCalendar.getHolidaysOnDate(hd, il) || [];
  const events = events0.filter((ev) => !(ev.getFlags() & flags.ROSH_CHODESH));
  for (const ev of events) {
    if (ev.getDesc() === 'Shabbat Shuva') {
      handleSpecial(`Shabbat Shuva (with ${parshaName})`);
    } else {
      const key = getLeyningKeyForEvent(ev, il);
      if (key) {
        handleSpecial(key);
      }
    }
  }
  if (!haft) {
    const day = hd.getDate();
    if (parshaName === 'Pinchas' && day > 17) {
      // Pinchas is always read in Tamuz (never another month)
      // either on the 14, 16, 17 (in Israel), 19, 21, 23, 24
      handleSpecial('Pinchas occurring after 17 Tammuz');
    } else if (day === 30 || day === 1) {
      const key = (parshaName === 'Masei' || parshaName === 'Matot-Masei') ?
        `${parshaName} on Shabbat Rosh Chodesh` :
        'Shabbat Rosh Chodesh';
      handleSpecial(key);
    } else if (parshaName === 'Ki Teitzei' && day === 14) {
      // Ki Teitzei is always read in Elul on 9, 11, 13 or 14
      // "Because Shabbat Re’eh was Rosh Ḥodesh, the usual 3rd haftarah of
      // consolation was not read. Chant the haftarah of Ki tetse and then
      // the haftarah of Re’eh as a single haftarah.
      // In the book of Isaiah these two brief passages are adjacent."
      // Source: Luaḥ Hashanah, Rabbi Miles B. Cohen and Leslie Rubin
      handleSpecial('Ki Teitzei with 3rd Haftarah of Consolation');
    } else if (hd.getMonth() !== months.AV) {
      // Parashat Re'eh is always read in Av on 25, 27, 29 or 30.
      // When it coincides with Erev Rosh Chodesh, the Haftarah is
      // עניה סוערה (Isaiah 54:11-55:5) and not מחר חדש
      const tommorow = hd.next().getDate();
      if (tommorow === 30 || tommorow === 1) {
        handleSpecial('Shabbat Machar Chodesh');
      }
    }
  }
  return {aliyot, reason, haft, seph};
}
