import {HDate, months} from '@hebcal/hdate';
import {flags} from '@hebcal/core/dist/esm/event';
import {
  getLeyningForHoliday,
  getLeyningForHolidayKey,
} from './getLeyningForHoliday';
import {getLeyningKeyForEvent} from './getLeyningKeyForEvent';
import {
  getLeyningForParshaHaShavua,
  getWeekdayReading,
  makeLeyningNames,
} from './leyning';
import {Leyning, LeyningWeekday} from './types';
import {
  getSedra,
  SedraResult,
  getHolidaysOnDate,
  ParshaEvent,
  HolidayEvent,
} from '@hebcal/core';
import {
  makeLeyningParts,
  makeSummaryFromParts,
  translateLeyning,
} from './common';

function findParshaHaShavua(saturday: HDate, il: boolean): SedraResult {
  const hyear = saturday.getFullYear();
  const sedra = getSedra(hyear, il);
  const parsha = sedra.lookup(saturday);
  if (!parsha.chag) {
    return parsha;
  }
  // Special case between YK and Simchat Torah
  // If Vayeilech or Ha'azinu occurs between RH and YK, the following block for
  // Monday/Thursday weekday isn't executed because the above sedra.lookup()
  // would have already found the regular Saturday parsha.
  if (saturday.getMonth() === months.TISHREI) {
    const dd = saturday.getDate();
    const simchatTorah = il ? 22 : 23;
    if (dd > 2 && dd <= simchatTorah) {
      return {
        parsha: ['Vezot Haberakhah'],
        chag: false,
        num: 54,
        hdate: saturday,
        il,
      };
    }
  }
  // Search for next regular parsha, which could even spill into next year
  const endOfYear = new HDate(1, months.TISHREI, hyear + 1).abs() - 1;
  const endAbs = endOfYear + 30;
  for (let sat2 = saturday.abs() + 7; sat2 <= endAbs; sat2 += 7) {
    const sedra2 = sat2 > endOfYear ? getSedra(hyear + 1, il) : sedra;
    const parsha2 = sedra2.lookup(sat2);
    if (!parsha2.chag) {
      return parsha2;
    }
  }
  /* NOTREACHED */
  throw new Error(`can't findParshaHaShavua for ${saturday}/${il}`);
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
 * @param {string} [language] language for summary (default 'en')
 */
export function getLeyningOnDate(
  hdate: HDate,
  il: boolean,
  wantarray?: false,
  language?: string
): Leyning | LeyningWeekday | undefined;
export function getLeyningOnDate(
  hdate: HDate,
  il: boolean,
  wantarray: true,
  language?: string
): (Leyning | LeyningWeekday)[];
export function getLeyningOnDate(
  hdate: HDate,
  il: boolean,
  wantarray = false,
  language = 'en'
): (Leyning | LeyningWeekday) | (Leyning | LeyningWeekday)[] | undefined {
  const dow = hdate.getDay();
  const arr: (Leyning | LeyningWeekday)[] = [];
  let hasParshaHaShavua = false;
  if (dow === 6) {
    const hyear = hdate.getFullYear();
    const sedra = getSedra(hyear, il);
    const parsha = sedra.lookup(hdate);
    if (!parsha.chag) {
      const parshaEvent = new ParshaEvent(parsha);
      const reading = getLeyningForParshaHaShavua(parshaEvent, il, language);
      if (wantarray) {
        hasParshaHaShavua = true;
        arr.push(reading);
      } else {
        return reading;
      }
    }
  }
  const events = getHolidaysOnDate(hdate, il) || [];
  let hasFullKriyah = false;
  for (const ev of events) {
    const specialShabbat = Boolean(
      ev.getFlags() & (flags.SPECIAL_SHABBAT | flags.ROSH_CHODESH)
    );
    if (hasParshaHaShavua && specialShabbat) {
      continue;
    }
    const reading = getLeyningForHoliday(ev, il);
    if (reading) {
      // Skip duplicate readings from overlapping events (eg, Rosh Chodesh + Chanukah)
      if (arr.some(r => r.name.en === reading.name.en)) continue;
      const fk = reading.fullkriyah;
      if (fk) {
        hasFullKriyah = true;
      }
      const specialMaftirOnly =
        hasParshaHaShavua && hasFullKriyah && fk.M && !fk['1'];
      if (!specialMaftirOnly) {
        arr.push(reading);
      }
      const mincha = getMincha(ev, il);
      if (mincha) {
        arr.push(mincha);
      }
      // Special case for Erev Simchat Torah - the only time we read Torah at night
      const desc = ev.getDesc();
      if (
        (il && desc === 'Sukkot VII (Hoshana Raba)') ||
        (!il && desc === 'Shmini Atzeret')
      ) {
        const erevST = getLeyningForHolidayKey('Erev Simchat Torah');
        arr.push(erevST!);
      }
    }
  }
  if (!hasFullKriyah && (dow === 1 || dow === 4)) {
    const saturday = hdate.onOrAfter(6);
    const parsha = findParshaHaShavua(saturday, il);
    const aliyot = getWeekdayReading(parsha.parsha);
    const parts = makeLeyningParts(aliyot);
    const reading: LeyningWeekday = {
      name: makeLeyningNames(parsha.parsha),
      type: 'weekday',
      parsha: parsha.parsha,
      parshaNum: parsha.num,
      weekday: aliyot,
      summary: makeSummaryFromParts(parts),
    };
    arr.unshift(reading);
  }
  // call translateLeyning on arr or arr[0]
  if (arr.length === 0) {
    return wantarray ? arr : arr[0];
  }
  if (wantarray) {
    return arr.map(reading => translateLeyning(reading as Leyning, language));
  }
  return translateLeyning(arr[0] as Leyning, language);
}

const minchaSuffix = ' (Mincha)';

function getMincha(ev: HolidayEvent, il: boolean): Leyning | undefined {
  const desc = ev.getDesc() + minchaSuffix;
  const reading1 = getLeyningForHolidayKey(desc, ev.cholHaMoedDay, il);
  if (reading1) {
    return reading1;
  }
  const desc2 = getLeyningKeyForEvent(ev, il);
  if (desc2) {
    const reading2 = getLeyningForHolidayKey(
      desc2 + minchaSuffix,
      ev.cholHaMoedDay,
      il
    );
    if (reading2) {
      return reading2;
    }
  }
  return undefined;
}
