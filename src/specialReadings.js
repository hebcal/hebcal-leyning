import {HebrewCalendar, flags} from '@hebcal/core';
import {calculateNumVerses, clone, cloneHaftara} from './common';
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
 * @private
 * @param {Event} ev
 * @param {string} key
 * @return {string}
 */
function getChanukahShabbatKey(ev, key) {
  if (key == 'Shabbat Rosh Chodesh Chanukah') {
    return undefined;
  }
  if (ev.chanukahDay) {
    return (ev.chanukahDay == 8) ? 'Shabbat Chanukah II' : 'Shabbat Chanukah';
  }
  return undefined;
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
 * @return {Aliyah | Aliyah[]}
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
    const special = lookupFestival(key);
    if (special) {
      handleSpecial(special, key);
    }
  });
  if (!haft) {
    const day = hd.getDate();
    if (day === 30 || day === 1) {
      const key = 'Shabbat Rosh Chodesh';
      const special = lookupFestival(key);
      handleSpecial(special, key);
    } else {
      const tommorow = hd.next().getDate();
      if (tommorow === 30 || tommorow === 1) {
        const key = 'Shabbat Machar Chodesh';
        const special = lookupFestival(key);
        handleSpecial(special, key);
      }
    }
  }
  return haft;
}
