import {Event, HebrewCalendar, flags} from '@hebcal/core';
import {formatAliyahWithBook} from './common.js';
import {getLeyningForHoliday, getLeyningForHolidayKey} from './getLeyningForHoliday.js';
import {getLeyningKeyForEvent} from './getLeyningKeyForEvent.js';
import {getLeyningForParshaHaShavua} from './leyning.js';

const fmt = new Intl.DateTimeFormat('en-US', {
  year: 'numeric', month: 'short', day: '2-digit',
});

/**
 * @private
 * @param {Date} dt
 * @return {string}
 */
function fmtDate(dt) {
  const s = fmt.format(dt).split(' ');
  return s[1].substring(0, 2) + '-' + s[0] + '-' + s[2];
}

/**
 * @private
 * @param {Event[]} events
 * @return {Object<string,boolean>}
 */
export function getParshaDates(events) {
  const parshaEvents = events.filter((ev) => ev.getFlags() === flags.PARSHA_HASHAVUA);
  const parshaDates = parshaEvents.reduce((set, ev) => {
    set[ev.getDate().toString()] = true;
    return set;
  }, {});
  return parshaDates;
}

/**
 * @private
 * @param {fs.WriteStream} stream
 * @param {number} hyear
 * @param {boolean} il
 */
export function writeFullKriyahCsv(stream, hyear, il) {
  const events0 = HebrewCalendar.calendar({
    year: hyear,
    isHebrewYear: true,
    sedrot: true,
    il: il,
  });
  const events = events0.filter((ev) => ev.getDesc() !== 'Rosh Chodesh Tevet');
  const parshaDates = getParshaDates(events);
  stream.write('"Date","Parashah","Aliyah","Reading","Verses"\r\n');
  for (const ev of events) {
    if (ev.getFlags() === flags.PARSHA_HASHAVUA || !parshaDates[ev.getDate().toString()]) {
      writeFullKriyahEvent(stream, ev, il);
    }
  }
}

/**
 * @private
 * @param {Event} ev
 * @return {boolean}
 */
function ignore(ev) {
  const mask = ev.getFlags();
  if (mask === flags.SPECIAL_SHABBAT) {
    return true;
  }
  if (mask !== flags.ROSH_CHODESH) {
    return false;
  }
  return ev.getDate().getDay() === 6;
}

/**
 * @private
 * @param {fs.WriteStream} stream
 * @param {Event} ev
 * @param {boolean} il
 */
export function writeFullKriyahEvent(stream, ev, il) {
  if (ignore(ev)) {
    return;
  }
  const mask = ev.getFlags();
  const isParsha = mask === flags.PARSHA_HASHAVUA;
  const reading = isParsha ? getLeyningForParshaHaShavua(ev, il) : getLeyningForHoliday(ev, il);
  if (reading) {
    writeCsvLines(stream, ev, reading, il, isParsha);
    if (!isParsha) {
      writeHolidayMincha(stream, ev, il);
    }
  }
}

/**
 * @private
 * @param {fs.WriteStream} stream
 * @param {Event} ev
 * @param {boolean} il
 */
export function writeHolidayMincha(stream, ev, il) {
  const desc = ev.getDesc();
  const minchaDesc1 = desc + ' (Mincha)';
  const readingMincha1 = getLeyningForHolidayKey(minchaDesc1, ev.cholHaMoedDay, il);
  const readingMincha = readingMincha1 ||
    getLeyningForHolidayKey(getLeyningKeyForEvent(ev, il) + ' (Mincha)', ev.cholHaMoedDay, il);
  if (readingMincha) {
    const minchaEv = new Event(ev.getDate(), minchaDesc1, flags.USER_EVENT);
    writeCsvLines(stream, minchaEv, readingMincha, il, false);
  }
}

/**
 * Formats reading for CSV
 * @param {fs.WriteStream} stream
 * @param {Event} ev
 * @param {Leyning} reading
 * @param {boolean} il
 * @param {boolean} isParsha
 */
export function writeCsvLines(stream, ev, reading, il, isParsha) {
  const parsha = isParsha ? ev.basename() : getLeyningKeyForEvent(ev, il) || ev.render();
  const date = fmtDate(ev.getDate().greg());
  const lines = getFullKriyahLines(reading);
  for (const s of lines) {
    const code = s[0].charCodeAt(0);
    if (code < 48 || code > 57) {
      s[0] = `"${s[0]}"`;
    }
    stream.write(`${date},"${parsha}",${s[0]},"${s[1]}",${s[2]}\r\n`);
  }
  stream.write('\r\n');
}

/**
 * @private
 * @param {any} reading
 * @return {any[]}
 */
function getFullKriyahLines(reading) {
  const lines = [];
  if (reading.fullkriyah) {
    for (const [num, a] of Object.entries(reading.fullkriyah)) {
      if (typeof a !== 'undefined') {
        const k = num == 'M' ? 'maf' : num;
        let aliyah = formatAliyahWithBook(a);
        if (reading.reason?.[num]) {
          aliyah += ' | ' + reading.reason[num];
        }
        lines.push([k, aliyah, a.v || '']);
      }
    }
  }
  if (reading.haftara) {
    let haftara = reading.haftara.replace(/,/g, ';');
    if (reading.reason?.haftara) {
      haftara += ' | ' + reading.reason.haftara;
    }
    const title = reading.sephardic ? 'Haftara for Ashkenazim' : 'Haftara';
    lines.push([title, haftara, reading.haftaraNumV || '']);
  }
  if (reading.sephardic) {
    let sephardic = reading.sephardic.replace(/,/g, ';');
    if (reading.reason?.sephardic) {
      sephardic += ' | ' + reading.reason.sephardic;
    }
    lines.push(['Haftara for Sephardim', sephardic, reading.sephardicNumV || '']);
  }
  if (reading.triHaftara) {
    const haftara = reading.triHaftara.replace(/,/g, ';');
    lines.push(['Alternate Haftara', haftara, reading.triHaftaraNumV || '']);
  }
  if (reading.megillah) {
    for (const [num, a] of Object.entries(reading.megillah)) {
      if (typeof a !== 'undefined') {
        const aliyah = formatAliyahWithBook(a);
        lines.push([`Megillah Ch. ${num}`, aliyah, a.v || '']);
      }
    }
  }
  return lines;
}
