import {HebrewCalendar, flags} from '@hebcal/core';
import {getLeyningForParshaHaShavua, getLeyningForHoliday, formatAliyahWithBook} from './leyning';
import {getTriennialForParshaHaShavua} from './triennial';

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
 * @param {fs.WriteStream} stream
 * @param {number} hyear
 * @param {boolean} il
 */
export function writeFullKriyahCsv(stream, hyear, il) {
  const events = HebrewCalendar.calendar({
    year: hyear,
    isHebrewYear: true,
    sedrot: true,
    il: il,
  });
  stream.write('"Date","Parashah","Aliyah","Reading","Verses"\r\n');
  events.forEach((ev) => writeFullKriyahEvent(stream, ev, il));
}

/**
 * @private
 * @param {fs.WriteStream} stream
 * @param {number} hyear
 */
export function writeTriennialCsv(stream, hyear) {
  const events = HebrewCalendar.calendar({
    year: hyear,
    isHebrewYear: true,
    numYears: 3,
    sedrot: true,
    il: false,
  });
  stream.write('"Date","Parashah","Aliyah","Triennial Reading"\r\n');
  events.forEach((ev) => writeTriennialEvent(stream, ev));
}

/**
 * @private
 * @param {fs.WriteStream} stream
 * @param {Event} ev
 * @param {boolean} il
 */
function writeTriennialEvent(stream, ev) {
  const mask = ev.getFlags();
  const dt = ev.getDate().greg();
  if (ignore(mask, dt)) {
    return;
  }
  const isParsha = mask === flags.PARSHA_HASHAVUA;
  const reading0 = isParsha ? getTriennialForParshaHaShavua(ev) : getLeyningForHoliday(ev, false);
  if (!reading0) {
    return;
  }
  let reading;
  if (isParsha) {
    const fk = getLeyningForParshaHaShavua(ev, false);
    reading = {
      haftara: fk.haftara,
      sephardic: fk.sephardic,
      reason: fk.reason,
      fullkriyah: reading0,
    };
  } else {
    reading = reading0;
  }
  const date = fmtDate(dt);
  const parsha = isParsha ? ev.basename() : ev.render();
  const lines = getFullKriyahLines(reading);
  lines.forEach((s) => {
    const code = s[0].charCodeAt(0);
    if (code < 48 || code > 57) {
      s[0] = `"${s[0]}"`;
    }
    stream.write(`${date},"${parsha}",${s[0]},"${s[1]}",${s[2]}\r\n`);
  });
  stream.write('\r\n');
}

/**
 * @private
 * @param {number} mask
 * @param {Date} dt
 * @return {boolean}
 */
function ignore(mask, dt) {
  if (mask === flags.SPECIAL_SHABBAT) {
    return true;
  }
  if (mask === flags.ROSH_CHODESH && dt.getDay() === 6) {
    return true;
  }
  return false;
}

/**
 * @private
 * @param {fs.WriteStream} stream
 * @param {Event} ev
 * @param {boolean} il
 */
function writeFullKriyahEvent(stream, ev, il) {
  const mask = ev.getFlags();
  const dt = ev.getDate().greg();
  if (ignore(mask, dt)) {
    return;
  }
  const isParsha = mask === flags.PARSHA_HASHAVUA;
  const reading = isParsha ? getLeyningForParshaHaShavua(ev, il) : getLeyningForHoliday(ev, il);
  if (!reading) {
    return;
  }
  const date = fmtDate(dt);
  const parsha = isParsha ? ev.basename() : ev.render();
  const lines = getFullKriyahLines(reading);
  lines.forEach((s) => {
    const code = s[0].charCodeAt(0);
    if (code < 48 || code > 57) {
      s[0] = `"${s[0]}"`;
    }
    stream.write(`${date},"${parsha}",${s[0]},"${s[1]}",${s[2]}\r\n`);
  });
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
    Object.keys(reading.fullkriyah).forEach((num) => {
      const a = reading.fullkriyah[num];
      if (typeof a !== 'undefined') {
        const k = num == 'M' ? 'maf' : num;
        let aliyah = formatAliyahWithBook(a);
        if (reading.reason && reading.reason[num]) {
          aliyah += ' | ' + reading.reason[num];
        }
        lines.push([k, aliyah, a.v || '']);
      }
    });
  }
  let specialHaftara = false;
  if (reading.haftara) {
    let aliyah = reading.haftara;
    if (reading.reason && reading.reason.haftara) {
      specialHaftara = true;
      aliyah += ' | ' + reading.reason.haftara;
    }
    lines.push(['Haftara', aliyah, '']);
  }
  if (reading.sephardic && !specialHaftara) {
    lines.push(['Haftara for Sephardim', reading.sephardic, '']);
  }
  return lines;
}
