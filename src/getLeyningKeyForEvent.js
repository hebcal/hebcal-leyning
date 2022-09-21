import {HDate, months, flags} from '@hebcal/core';
import {hasFestival} from './festival';

export const HOLIDAY_IGNORE_MASK = flags.DAF_YOMI | flags.OMER_COUNT | flags.SHABBAT_MEVARCHIM |
  flags.MOLAD | flags.USER_EVENT | flags.HEBREW_DATE | flags.MISHNA_YOMI | flags.MODERN_HOLIDAY;

/**
 * Based on the event date, type and title, finds the relevant leyning key
 * @param {Event} ev event
 * @param {boolean} [il] true if Israel holiday scheme
 * @return {string} key to look up in holiday-reading.json
 */
export function getLeyningKeyForEvent(ev, il = false) {
  const mask = ev.getFlags();
  if (mask & HOLIDAY_IGNORE_MASK) {
    return undefined;
  }
  // Skip all Erevs except for Simchat Torah
  const desc = ev.getDesc();
  if (mask & flags.EREV && desc !== 'Erev Simchat Torah') {
    return undefined;
  }
  const hd = ev.getDate();
  const day = hd.getDate();
  const dow = hd.abs() % 7;
  const month = hd.getMonth();
  const isShabbat = (dow == 6);
  const isRoshChodesh = (day == 1 || day == 30);
  const holiday = ev.basename();
  const isPesach = holiday === 'Pesach';
  if (il && isPesach) {
    if (isShabbat) {
      return day === 15 || day === 21 ? desc + ' (on Shabbat)' : 'Pesach Shabbat Chol ha-Moed';
    }
    return desc;
  }
  if (day == 1 && month === months.TISHREI) {
    return isShabbat ? 'Rosh Hashana I (on Shabbat)' : 'Rosh Hashana I';
  } else if (ev.cholHaMoedDay) {
    // Sukkot or Pesach
    if (isShabbat) {
      return holiday + ' Shabbat Chol ha-Moed';
    } else if (desc == 'Sukkot VII (Hoshana Raba)') {
      return 'Sukkot Final Day (Hoshana Raba)';
    }
    // If Shabbat falls on the third day of Chol ha-Moed Pesach,
    // the readings for the third, fourth, and fifth days are moved ahead
    let cholHaMoedDay = ev.cholHaMoedDay;
    if (isPesach && cholHaMoedDay >= 3) {
      if (dow == 0 && cholHaMoedDay == 4) {
        cholHaMoedDay = 3;
      } else if (dow == 1 && cholHaMoedDay == 5) {
        cholHaMoedDay = 4;
      }
    }
    return `${holiday} Chol ha-Moed Day ${cholHaMoedDay}`;
  } else if (ev.chanukahDay) {
    if (isShabbat && isRoshChodesh) {
      return 'Shabbat Rosh Chodesh Chanukah';
    } else if (isRoshChodesh && ev.chanukahDay == 7) {
      return `Chanukah Day 7 (on Rosh Chodesh)`;
    } else if (isShabbat) {
      return `Chanukah Day ${ev.chanukahDay} (on Shabbat)`;
    } else {
      return `Chanukah Day ${ev.chanukahDay}`;
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
    if (isRoshChodesh) {
      if (desc === 'Rosh Chodesh Tevet') {
        return 'Shabbat Rosh Chodesh Chanukah';
      }
      return 'Shabbat Rosh Chodesh';
    }
    const desc2 = desc + ' (on Shabbat)';
    if (hasFestival(desc2)) {
      return desc2;
    }
  }

  if (hasFestival(desc)) {
    return desc;
  }

  if (isShabbat) {
    const tommorow = hd.next().getDate();
    if (tommorow === 30 || tommorow === 1) {
      return 'Shabbat Machar Chodesh';
    }
  }

  if (desc === 'Rosh Hashana LaBehemot') {
    return undefined;
  }

  if (desc === 'Rosh Chodesh Tevet') {
    if (isShabbat) {
      return 'Shabbat Rosh Chodesh Chanukah';
    }
    if (day === 30 || HDate.shortKislev(hd.getFullYear())) {
      return 'Chanukah Day 6'; // 30th of Kislev or 1st of Tevet
    } else {
      return 'Chanukah Day 7 (on Rosh Chodesh)'; // 1st of Tevet
    }
  }

  if (isRoshChodesh) {
    return desc;
  }

  if (desc === 'Tish\'a B\'Av (observed)') {
    return 'Tish\'a B\'Av';
  }

  return undefined;
}
