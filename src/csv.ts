import {Event, HebrewCalendar, HolidayEvent, flags} from '@hebcal/core';
import {WriteStream} from 'node:fs';
import {formatAliyahWithBook} from './common';
import {
  getLeyningForHoliday,
  getLeyningForHolidayKey,
} from './getLeyningForHoliday';
import {getLeyningKeyForEvent} from './getLeyningKeyForEvent';
import {getLeyningForParshaHaShavua} from './leyning';
import {Leyning} from './types';

const fmt = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: '2-digit',
});

function fmtDate(dt: Date): string {
  const s = fmt.format(dt).split(' ');
  return s[1].substring(0, 2) + '-' + s[0] + '-' + s[2];
}

export interface StringToBoolMap {
  [key: string]: boolean;
}

export function getParshaDates(events: Event[]): StringToBoolMap {
  const parshaEvents = events.filter(
    ev => ev.getFlags() === flags.PARSHA_HASHAVUA
  );
  const emptyMap: StringToBoolMap = {};
  const parshaDates = parshaEvents.reduce((set, ev) => {
    set[ev.getDate().toString()] = true;
    return set;
  }, emptyMap);
  return parshaDates;
}

export function writeFullKriyahCsv(
  stream: WriteStream,
  hyear: number,
  il: boolean
) {
  const events0 = HebrewCalendar.calendar({
    year: hyear,
    isHebrewYear: true,
    sedrot: true,
    il: il,
  });
  const events = events0.filter(
    (ev: Event) => ev.getDesc() !== 'Rosh Chodesh Tevet'
  );
  const parshaDates = getParshaDates(events);
  stream.write('"Date","Parashah","Aliyah","Reading","Verses"\r\n');
  for (const ev of events) {
    if (
      ev.getFlags() === flags.PARSHA_HASHAVUA ||
      !parshaDates[ev.getDate().toString()]
    ) {
      writeFullKriyahEvent(stream, ev, il);
    }
  }
}

function ignore(ev: Event): boolean {
  const mask = ev.getFlags();
  if (mask === flags.SPECIAL_SHABBAT) {
    return true;
  }
  if (mask !== flags.ROSH_CHODESH) {
    return false;
  }
  return ev.getDate().getDay() === 6;
}

export function writeFullKriyahEvent(
  stream: WriteStream,
  ev: Event,
  il: boolean
) {
  if (ignore(ev)) {
    return;
  }
  const mask = ev.getFlags();
  const isParsha = mask === flags.PARSHA_HASHAVUA;
  const reading = isParsha
    ? getLeyningForParshaHaShavua(ev, il)
    : getLeyningForHoliday(ev, il);
  if (reading) {
    writeCsvLines(stream, ev, reading, il, isParsha);
    if (!isParsha) {
      writeHolidayMincha(stream, ev as HolidayEvent, il);
      const desc = ev.getDesc();
      if (
        (il && desc === 'Sukkot VII (Hoshana Raba)') ||
        (!il && desc === 'Shmini Atzeret')
      ) {
        const ev2 = new HolidayEvent(
          ev.getDate(),
          'Erev Simchat Torah',
          flags.EREV
        );
        writeFullKriyahEvent(stream, ev2, il);
      }
    }
  }
}

export function writeHolidayMincha(
  stream: WriteStream,
  ev: HolidayEvent,
  il: boolean
) {
  const desc = ev.getDesc();
  const minchaDesc1 = desc + ' (Mincha)';
  const readingMincha1 = getLeyningForHolidayKey(
    minchaDesc1,
    ev.cholHaMoedDay,
    il
  );
  const readingMincha =
    readingMincha1 ||
    getLeyningForHolidayKey(
      getLeyningKeyForEvent(ev, il) + ' (Mincha)',
      ev.cholHaMoedDay,
      il
    );
  if (readingMincha) {
    const minchaEv = new Event(ev.getDate(), minchaDesc1, flags.USER_EVENT);
    writeCsvLines(stream, minchaEv, readingMincha, il, false);
  }
}

/**
 * Formats reading for CSV
 */
export function writeCsvLines(
  stream: WriteStream,
  ev: Event,
  reading: Leyning,
  il: boolean,
  isParsha: boolean
) {
  const parsha = isParsha
    ? ev.basename()
    : getLeyningKeyForEvent(ev, il) || ev.render();
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

function getFullKriyahLines(reading: Leyning): any[] {
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
    lines.push([
      'Haftara for Sephardim',
      sephardic,
      reading.sephardicNumV || '',
    ]);
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
