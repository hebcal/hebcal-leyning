import {getLeyningForParshaHaShavua, getLeyningForHoliday, formatAliyahWithBook} from './leyning';
import {HebrewCalendar, flags} from '@hebcal/core';

/**
 *
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
  stream.write('"Date","Parashah","Aliyah","Reading","Verses"\n');
  events.forEach((ev) => writeFullKriyahEvent(stream, ev, il));
  stream.end();
}

/**
 * @param {fs.WriteStream} stream
 * @param {Event} ev
 * @param {boolean} il
 */
export function writeFullKriyahEvent(stream, ev, il) {
  const mask = ev.getFlags();
  if (mask === flags.SPECIAL_SHABBAT) {
    return;
  }
  const isParsha = mask === flags.PARSHA_HASHAVUA;
  const reading = isParsha ? getLeyningForParshaHaShavua(ev, il) : getLeyningForHoliday(ev, il);
  if (!reading) {
    return;
  }
  const dt = ev.getDate().greg();
  const date = dt.toLocaleDateString('en-US');
  const parsha = isParsha ? ev.basename() : ev.render();
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
  if (reading.haftara) {
    let aliyah = reading.haftara;
    if (reading.reason && reading.reason.haftara) {
      aliyah += ' | ' + reading.reason.haftara;
    }
    lines.push(['Haftarah', aliyah, '']);
  }
  if (reading.sephardic) {
    lines.push(['Haftarah for Sephardim', reading.sephardic, '']);
  }
  lines.forEach((s) => stream.write(`${date},"${parsha}","${s[0]}","${s[1]}",${s[2]}\n`));
  stream.write('\n');
}
