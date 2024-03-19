import {HDate, HebrewCalendar, ParshaEvent, flags, months} from '@hebcal/core';
import {getLeyningForHoliday, getLeyningForHolidayKey} from './getLeyningForHoliday.js';
import {getLeyningKeyForEvent} from './getLeyningKeyForEvent.js';
import {getLeyningForParshaHaShavua, getWeekdayReading, makeLeyningNames} from './leyning.js';

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
  // Special case between YK and Simchat Torah
  if (saturday.getMonth() === months.TISHREI) {
    const dd = saturday.getDate();
    const simchatTorah = il ? 22 : 23;
    if (dd > 10 && dd <= simchatTorah) {
      return {
        parsha: ['Vezot Haberakhah'],
        chag: false,
        num: 54,
      };
    }
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
 * @param {boolean} [wantarray] to return an array of 0 or more readings
 * @return {Leyning|Leyning[]} map of aliyot
 */
export function getLeyningOnDate(hdate, il, wantarray = false) {
  const dow = hdate.getDay();
  const arr = [];
  let hasParshaHaShavua = false;
  if (dow === 6) {
    const hyear = hdate.getFullYear();
    const sedra = HebrewCalendar.getSedra(hyear, il);
    const parsha = sedra.lookup(hdate);
    if (!parsha.chag) {
      const parshaEvent = new ParshaEvent(hdate, parsha.parsha, il);
      const reading = getLeyningForParshaHaShavua(parshaEvent, il);
      if (wantarray) {
        hasParshaHaShavua = true;
        arr.push(reading);
      } else {
        return reading;
      }
    }
  }
  const events = HebrewCalendar.getHolidaysOnDate(hdate, il) || [];
  let hasFullKriyah = false;
  for (const ev of events) {
    if (hasParshaHaShavua && (ev.getFlags() & flags.SPECIAL_SHABBAT)) {
      continue;
    }
    const reading = getLeyningForHoliday(ev, il);
    if (reading) {
      arr.push(reading);
      if (reading.fullkriyah) {
        hasFullKriyah = true;
      }
      const mincha = getMincha(ev, il);
      if (mincha) {
        arr.push(mincha);
      }
    }
  }
  if (!hasFullKriyah && (dow === 1 || dow === 4)) {
    const saturday = hdate.onOrAfter(6);
    const parsha = findParshaHaShavua(saturday);
    const reading = {
      name: makeLeyningNames(parsha.parsha),
      parsha: parsha.parsha,
      parshaNum: parsha.num,
      weekday: getWeekdayReading(parsha.parsha),
    };
    arr.unshift(reading);
  }
  return wantarray ? arr : arr[0];
}

const minchaSuffix = ' (Mincha)';

/**
 * @private
 * @param {Event} ev
 * @param {boolean} il
 * @return {Leyning}
 */
function getMincha(ev, il) {
  const desc = ev.getDesc() + minchaSuffix;
  const reading1 = getLeyningForHolidayKey(desc, ev.cholHaMoedDay, il);
  if (reading1) {
    return reading1;
  }
  const desc2 = getLeyningKeyForEvent(ev, il);
  if (desc2) {
    const reading2 = getLeyningForHolidayKey(desc2 + minchaSuffix, ev.cholHaMoedDay, il);
    if (reading2) {
      return reading2;
    }
  }
  return undefined;
}
