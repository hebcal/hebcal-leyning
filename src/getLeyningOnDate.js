import {HebrewCalendar, HDate, months, ParshaEvent} from '@hebcal/core';
import {getLeyningForHoliday, getLeyningForHolidayKey} from './getLeyningForHoliday';
import {getLeyningKeyForEvent} from './getLeyningKeyForEvent';
import {getLeyningForParshaHaShavua, getLeyningForParsha} from './leyning';

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
  const hyear = hdate.getFullYear();
  const sedra = HebrewCalendar.getSedra(hyear, il);
  const parsha = sedra.lookup(hdate);
  if (dow === 6 && !parsha.chag) {
    const parshaEvent = new ParshaEvent(hdate, parsha.parsha, il);
    const reading = getLeyningForParshaHaShavua(parshaEvent, il);
    return wantarray ? [reading] : reading;
  }
  const events = HebrewCalendar.getHolidaysOnDate(hdate, il) || [];
  const arr = [];
  for (let i = 0; i < events.length; i++) {
    const ev = events[i];
    const reading = getLeyningForHoliday(ev, il);
    if (reading) {
      if (wantarray) {
        arr.push(reading);
        const mincha = getMincha(ev, il);
        if (mincha) {
          arr.push(mincha);
        }
      } else {
        return reading;
      }
    }
  }
  if (wantarray && arr.length !== 0) {
    return arr;
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
    return wantarray ? [result] : result;
  }
  // no reading today: it's not Shabbat, Mon/Thu, or a Torah-reading holiday
  return wantarray ? [] : undefined;
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
  const reading1 = getLeyningForHolidayKey(desc);
  if (reading1) {
    return reading1;
  }
  const desc2 = getLeyningKeyForEvent(ev, il);
  if (desc2) {
    const reading2 = getLeyningForHolidayKey(desc2 + minchaSuffix);
    if (reading2) {
      return reading2;
    }
  }
  return undefined;
}
