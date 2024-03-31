import {HDate, flags, months} from '@hebcal/core';
import {hasFestival} from './festival.js';

export const HOLIDAY_IGNORE_MASK = flags.DAF_YOMI | flags.OMER_COUNT | flags.SHABBAT_MEVARCHIM |
  flags.MOLAD | flags.USER_EVENT | flags.HEBREW_DATE | flags.MISHNA_YOMI |
  flags.MODERN_HOLIDAY | flags.YERUSHALMI_YOMI;

/**
 * Based on the event date, type and title, finds the relevant leyning key
 * @param {Event} ev event
 * @param {boolean} [il] true if Israel holiday scheme
 * @return {string} key to look up in holiday-reading.json
 */
export function getLeyningKeyForEvent(ev, il = false) {
  if (typeof ev.eventTime !== 'undefined') {
    return undefined;
  }
  const mask = ev.getFlags();
  if (mask & HOLIDAY_IGNORE_MASK) {
    return undefined;
  }
  // Skip all Erevs except for Simchat Torah
  const desc = ev.getDesc();
  if (mask & flags.EREV && !hasFestival(desc)) {
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
  }
  const cholHaMoedDay = ev.cholHaMoedDay;
  if (typeof cholHaMoedDay === 'number') {
    // Sukkot or Pesach
    if (isShabbat) {
      return holiday + ' Shabbat Chol ha-Moed';
    } else if (desc == 'Sukkot VII (Hoshana Raba)') {
      return 'Sukkot Final Day (Hoshana Raba)';
    }
    if (isPesach && cholHaMoedDay) {
      if (dow === 0 && desc === 'Pesach IV (CH\'\'M)') {
        return 'Pesach Chol ha-Moed Day 2 on Sunday';
      } else if (dow === 1 && desc === 'Pesach V (CH\'\'M)') {
        return 'Pesach Chol ha-Moed Day 3 on Monday';
      }
    }
    return `${holiday} Chol ha-Moed Day ${cholHaMoedDay}`;
  }
  const chanukahDay = ev.chanukahDay;
  if (typeof chanukahDay === 'number') {
    if (isShabbat && isRoshChodesh) {
      return 'Shabbat Rosh Chodesh Chanukah';
    } else if (isRoshChodesh && chanukahDay == 7) {
      return `Chanukah Day 7 (on Rosh Chodesh)`;
    } else if (isShabbat) {
      return `Chanukah Day ${chanukahDay} (on Shabbat)`;
    } else {
      return `Chanukah Day ${chanukahDay}`;
    }
  }

  if (isRoshChodesh && (desc == 'Shabbat HaChodesh' || desc == 'Shabbat Shekalim')) {
    return desc + ' (on Rosh Chodesh)';
  }

  if (il && desc == 'Shmini Atzeret') {
    return 'Simchat Torah';
  }

  if (desc === 'Chag HaBanot') {
    return undefined;
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
