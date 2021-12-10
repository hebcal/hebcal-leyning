import {HebrewCalendar, flags} from '@hebcal/core';
import {getLeyningForParshaHaShavua, getLeyningForHoliday,
  formatAliyahWithBook, getLeyningKeyForEvent} from './leyning';
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
 * @param {Event[]} events
 * @return {Object<string,boolean>}
 */
function getParshaDates(events) {
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
  const events = HebrewCalendar.calendar({
    year: hyear,
    isHebrewYear: true,
    sedrot: true,
    il: il,
  });
  const parshaDates = getParshaDates(events);
  stream.write('"Date","Parashah","Aliyah","Reading","Verses"\r\n');
  events.forEach((ev) => {
    if (ev.getFlags() === flags.PARSHA_HASHAVUA || !parshaDates[ev.getDate().toString()]) {
      writeFullKriyahEvent(stream, ev, il);
    }
  });
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
  const parshaDates = getParshaDates(events);
  stream.write('"Date","Parashah","Aliyah","Triennial Reading","Verses"\r\n');
  events.forEach((ev) => {
    if (ev.getFlags() === flags.PARSHA_HASHAVUA || !parshaDates[ev.getDate().toString()]) {
      writeTriennialEvent(stream, ev);
    }
  });
}

/**
 * @private
 * @param {fs.WriteStream} stream
 * @param {Event} ev
 */
export function writeTriennialEvent(stream, ev) {
  if (ignore(ev)) {
    return;
  }
  const isParsha = ev.getFlags() === flags.PARSHA_HASHAVUA;
  const reading0 = isParsha ? getTriennialForParshaHaShavua(ev) : getLeyningForHoliday(ev, false);
  if (!reading0) {
    return;
  }
  let reading;
  if (isParsha) {
    const fk = getLeyningForParshaHaShavua(ev, false);
    reading = {
      haftara: fk.haftara,
      haftaraNumV: fk.haftaraNumV,
      sephardic: fk.sephardic,
      sephardicNumV: fk.sephardicNumV,
      reason: fk.reason,
      fullkriyah: reading0,
    };
  } else {
    reading = reading0;
  }
  writeCsvLines(stream, ev, reading, false);
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
  const isParsha = ev.getFlags() === flags.PARSHA_HASHAVUA;
  const reading = isParsha ? getLeyningForParshaHaShavua(ev, il) : getLeyningForHoliday(ev, il);
  if (!reading) {
    return;
  }
  writeCsvLines(stream, ev, reading, il);
}

/**
 * @private
 * @param {fs.WriteStream} stream
 * @param {Event} ev
 * @param {Leyning} reading
 * @param {boolean} il
 */
function writeCsvLines(stream, ev, reading, il) {
  const isParsha = ev.getFlags() === flags.PARSHA_HASHAVUA;
  const parsha = isParsha ? ev.basename() : getLeyningKeyForEvent(ev, il) || ev.render();
  const date = fmtDate(ev.getDate().greg());
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
    let haftara = reading.haftara.replace(/,/g, ';');
    if (reading.reason && reading.reason.haftara) {
      specialHaftara = true;
      haftara += ' | ' + reading.reason.haftara;
    }
    lines.push(['Haftara', haftara, reading.haftaraNumV || '']);
  }
  if (reading.sephardic && !specialHaftara) {
    const sephardic = reading.sephardic.replace(/,/g, ';');
    lines.push(['Haftara for Sephardim', sephardic, reading.sephardicNumV || '']);
  }
  return lines;
}
