import {parshaYear} from '@hebcal/core/dist/esm/parshaYear';
import {Event, flags} from '@hebcal/core/dist/esm/event';
import {HolidayEvent} from '@hebcal/core/dist/esm/HolidayEvent';
import {getHolidaysForYearArray} from '@hebcal/core/dist/esm/holidays';
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
  const parshaEvents = events.filter(ev => ev.getFlags() === PARSHA_HASHAVUA);
  const emptyMap: StringToBoolMap = {};
  const parshaDates = parshaEvents.reduce((set, ev) => {
    set[ev.getDate().toString()] = true;
    return set;
  }, emptyMap);
  return parshaDates;
}

function getParshaAndHolidayEvents(year: number, il: boolean): Event[] {
  let events: Event[] = parshaYear(year, il);
  const holidays = getHolidaysForYearArray(year, il);
  events = events.concat(holidays);
  events.sort((a, b) => a.getDate().abs() - b.getDate().abs());
  return events;
}

const PARSHA_HASHAVUA = flags.PARSHA_HASHAVUA;

export function writeFullKriyahCsv(
  stream: WriteStream,
  hyear: number,
  il: boolean
) {
  const events0 = getParshaAndHolidayEvents(hyear, il);
  const events = events0.filter(
    (ev: Event) => ev.getDesc() !== 'Rosh Chodesh Tevet'
  );
  const parshaDates = getParshaDates(events);
  stream.write('"Date","Parashah","Aliyah","Reading","Verses"\r\n');
  for (const ev of events) {
    if (
      ev.getFlags() === PARSHA_HASHAVUA ||
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
  const isParsha = mask === PARSHA_HASHAVUA;
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
  const date = fmtDate(ev.greg());
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

type CsvLine = [string, string, string | number];

function getFullKriyahLines(reading: Leyning): CsvLine[] {
  const lines: CsvLine[] = [];
  if (reading.fullkriyah) {
    for (const [num, aliyah] of Object.entries(reading.fullkriyah)) {
      if (aliyah) {
        const k = num === 'M' ? 'maf' : num;
        let str = formatAliyahWithBook(aliyah);
        if (aliyah.reason) {
          str += ' | ' + aliyah.reason;
        }
        lines.push([k, str, aliyah.v || '']);
      }
    }
  }
  if (reading.haftara) {
    let haftara = reading.haftara.replace(/,/g, ';');
    const note = reading.reason?.haftara;
    if (note) {
      haftara += ' | ' + note;
    }
    const title = reading.sephardic ? 'Haftara for Ashkenazim' : 'Haftara';
    lines.push([title, haftara, reading.haftaraNumV || '']);
  }
  if (reading.sephardic) {
    let sephardic = reading.sephardic.replace(/,/g, ';');
    const note = reading.reason?.sephardic;
    if (note) {
      sephardic += ' | ' + note;
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
      if (a) {
        const aliyah = formatAliyahWithBook(a);
        lines.push([`Megillah Ch. ${num}`, aliyah, a.v || '']);
      }
    }
  }
  return lines;
}
