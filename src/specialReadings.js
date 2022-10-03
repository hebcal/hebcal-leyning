import {HebrewCalendar, flags} from '@hebcal/core';
import {calculateNumVerses, clone, cloneHaftara, parshaToString} from './common';
import {lookupFestival} from './festival';
import {getLeyningKeyForEvent} from './getLeyningKeyForEvent';

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
 * If a special maftir occurs, modifies `aliyot` to replace `M` and sets `reason.M`
 * (and in some cases modifies the 6th and 7th aliyah, setting `reason['7']`).
 *
 * If a special Haftarah applies, returns the Haftarah object and sets `reason.haftara`.
 * If no special Haftarah, returns `undefined`
 * @param {HDate} hd
 * @param {boolean} il
 * @param {Object<string,Aliyah>} aliyot
 * @param {Object<string,string>} reason
 * @param {string[]} parsha
 * @param {boolean} [wantSeph]
 * @return {Aliyah | Aliyah[]}
 */
export function specialReadings(hd, il, aliyot, reason, parsha, wantSeph=false) {
  let haft;
  let seph;
  let specialHaft = false;
  const parshaName = parsha ? parshaToString(parsha) : null;

  // eslint-disable-next-line require-jsdoc
  function handleSpecial(key) {
    const special = lookupFestival(key);
    if (!special) {
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
      mergeAliyotWithSpecial(aliyot, special.fullkriyah);
      Object.keys(special.fullkriyah).map((k) => reason[k] = key);
    }
  }

  const events0 = HebrewCalendar.getHolidaysOnDate(hd, il) || [];
  const events = events0.filter((ev) => !(ev.getFlags() & flags.ROSH_CHODESH));
  events.forEach((ev) => {
    if (ev.getDesc() === 'Shabbat Shuva' && parshaName) {
      handleSpecial(`Shabbat Shuva (with ${parshaName})`);
    } else {
      const key = getLeyningKeyForEvent(ev, il);
      if (key) {
        handleSpecial(key);
      }
    }
  });
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
    } else {
      const tommorow = hd.next().getDate();
      if (tommorow === 30 || tommorow === 1) {
        handleSpecial('Shabbat Machar Chodesh');
      }
    }
  }
  if (wantSeph && haft) {
    return {haft, seph};
  } else {
    return haft;
  }
}
