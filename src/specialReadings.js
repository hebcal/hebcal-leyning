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
    const special = lookupFestival(key);
    if (special) {
      const shabbatChanukah = getChanukahShabbatKey(ev, key);
      if (shabbatChanukah) {
        // only for Shabbat Chanukah I or Shabbat Chanukah II. Note
        // this section doesn't apply to Shabbat Rosh Chodesh Chanukah; that
        // case gets handled below with the mergeAliyotWithSpecial() logic
        haft = cloneHaftara(lookupFestival(shabbatChanukah).haft);
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
