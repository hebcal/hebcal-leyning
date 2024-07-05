import { Event, Locale, ParshaEvent, flags } from '@hebcal/core';
import parshiyotObj0 from './aliyot.json';
import {
  BOOK, calculateNumVerses, 
  parshaToString} from './common';
import { cloneHaftara, sumVerses } from './clone';
import { specialReadings2 } from './specialReadings';
import { makeLeyningParts, makeSummaryFromParts } from './summary';
import { Aliyah, AliyotMap, Leyning, LeyningNames, ParshaMeta } from './types';

type JsonAliyah = {
  k: number | string;
  b: string;
  e: string;
  v?: number;
  p?: number;
};

type JsonParshaMap = {
  [key: string]: string[];
}

type JsonParsha = {
  num: number | number[];
  hebrew?: string;
  book: number;
  haft?: JsonAliyah | JsonAliyah[];
  seph?: JsonAliyah | JsonAliyah[];
  fullkriyah: JsonParshaMap;
  weekday?: JsonParshaMap;
  combined?: boolean;
  p1?: string;
  p2?: string;
  num1?: number;
  num2?: number;
};

type Parshiyot = {
  [key: string]: JsonParsha;
};

const parshiyotObj: Parshiyot = parshiyotObj0 as Parshiyot;

/**
 * on doubled parshiot, read only the second Haftarah
 * except for Nitzavim-Vayelech and Achrei Mot-Kedoshim
 * @private
 */
function getHaftaraKey(parsha: string[]): string {
  const first = parsha[0];
  if (parsha.length === 2 && first == 'Achrei Mot') {
    return parshaToString(parsha); // 'Achrei Mot-Kedoshim'
  }
  if (parsha.length === 1 || first == 'Nitzavim') {
    return first;
  } else {
    return parsha[1];
  }
}

/**
 * Transliterated English and Hebrew names of this parsha
 * @param parsha untranslated name like ['Pinchas'] or ['Matot','Masei']
 */
export function makeLeyningNames(parsha: string[]): LeyningNames {
  const name = parshaToString(parsha);
  return {
    en: name,
    he: parsha.map((s) => Locale.lookupTranslation(s, 'he')).join('־'),
  };
}

/**
 * Looks up regular leyning for a weekly parsha with no special readings
 * @private
 * @param parsha untranslated name like 'Pinchas' or ['Pinchas'] or ['Matot','Masei']
 * @returns map of aliyot
 */
function getLeyningForParshaShabbatOnly(parsha: string | string[]): Leyning {
  const raw = lookupParsha(parsha);
  const fullkriyah: AliyotMap = {};
  const book = BOOK[raw.book];
  for (const [num, src] of Object.entries(raw.fullkriyah)) {
    const aliyah = {k: book, b: src[0], e: src[1]};
    calculateNumVerses(aliyah);
    fullkriyah[num] = aliyah;
  }
  const name = parshaToString(parsha);
  const parshaNameArray: string[] = raw.combined ? [raw.p1!, raw.p2!] : [name];
  const parts = makeLeyningParts(fullkriyah);
  const summary = makeSummaryFromParts(parts);
  const result: Leyning = {
    name: makeLeyningNames(parshaNameArray),
    parsha: parshaNameArray,
    parshaNum: raw.num,
    summary,
    fullkriyah: fullkriyah,
    haftara: '',
    haft: [],
  };
  if (parts.length > 1) {
    result.summaryParts = parts;
  }
  const hkey = getHaftaraKey(parshaNameArray);
  const haft0 = parshiyotObj[hkey].haft;
  if (haft0) {
    const haft = result.haft = cloneHaftara(haft0);
    result.haftara = makeSummaryFromParts(haft);
    result.haftaraNumV = sumVerses(haft);
  }
  const seph0 = parshiyotObj[hkey].seph;
  if (seph0) {
    const seph = result.seph = cloneHaftara(seph0);
    result.sephardic = makeSummaryFromParts(seph);
    result.sephardicNumV = sumVerses(seph);
  }
  return result;
}

/**
 * Looks up Monday/Thursday aliyot for a regular parsha
 * @param parsha untranslated name like 'Pinchas' or ['Pinchas'] or ['Matot','Masei']
 */
export function getWeekdayReading(parsha: string | string[]): AliyotMap {
  const raw = lookupParsha(parsha);
  const parshaMeta = raw.combined ? lookupParsha(raw.p1!) : raw;
  const aliyot = parshaMeta.weekday;
  if (!aliyot) {
    throw new Error(`Parsha missing weekday: ${parsha}`);
  }
  const book = BOOK[raw.book];
  const weekday: AliyotMap = {};
  for (let i = 1; i <= 3; i++) {
    const num = '' + i;
    const src = aliyot[num];
    const aliyah = {k: book, b: src[0], e: src[1]};
    calculateNumVerses(aliyah);
    weekday[num] = aliyah;
  }
  return weekday;
}

/**
 * Looks up regular leyning for a weekly parsha with no special readings
 * @param parsha untranslated name like 'Pinchas' or ['Pinchas'] or ['Matot','Masei']
 */
export function getLeyningForParsha(parsha: string | string[]): Leyning {
  const result = getLeyningForParshaShabbatOnly(parsha);
  result.weekday = getWeekdayReading(parsha);
  return result;
}

/**
 * Looks up leyning for a regular Shabbat parsha, including any special
 * maftir or Haftara.
 * @param ev the Hebcal event associated with this leyning
 * @param [il] in Israel
 * @returns map of aliyot
 */
export function getLeyningForParshaHaShavua(ev: Event, il: boolean=false): Leyning {
  if (typeof ev !== 'object' || typeof ev.getFlags !== 'function') {
    throw new TypeError(`Bad event argument: ${ev}`);
  } else if (ev.getFlags() != flags.PARSHA_HASHAVUA) {
    throw new TypeError(`Event must be parsha hashavua: ${ev.getDesc()}`);
  }
  // first, collect the default aliyot and haftara
  const parsha = (ev as ParshaEvent).parsha;
  const result = getLeyningForParshaShabbatOnly(parsha);
  const hd = ev.getDate();
  // Now, check for special maftir or haftara on same date
  const special = specialReadings2(parsha, hd, il, result.fullkriyah);
  const reason = special.reason;
  if (special.haft) {
    const haft = result.haft = cloneHaftara(special.haft);
    result.haftara = makeSummaryFromParts(haft);
    result.haftaraNumV = sumVerses(haft);
    if (special.seph) {
      const seph = result.seph = cloneHaftara(special.seph);
      result.sephardic = makeSummaryFromParts(seph);
      result.sephardicNumV = sumVerses(seph);
    } else if (result.seph) {
      delete result.seph;
      delete result.sephardic;
      delete result.sephardicNumV;
    }
  }
  if (reason['7'] || reason['M']) {
    result.fullkriyah = special.aliyot;
    const parts = makeLeyningParts(result.fullkriyah);
    result.summary = makeSummaryFromParts(parts);
    result.summaryParts = parts;
  }
  const reasons = Object.keys(reason);
  if (reasons.length !== 0) {
    result.reason = reason;
    for (const num of reasons) {
      if (num === 'haftara' || num === 'sephardic') {
        const haftObj = result[num === 'haftara' ? 'haft' : 'seph'];
        const hafts: Aliyah[] = Array.isArray(haftObj) ? haftObj : [haftObj!];
        for (const haft of hafts) {
          haft.reason = reason[num];
        }
      } else {
        const aliyah = result.fullkriyah[num];
        if (typeof aliyah === 'object') {
          aliyah.reason = reason[num];
        }
      }
    }
  }
  return result;
}

/**
 * Returns the parsha metadata
 * @param parsha untranslated name like 'Pinchas' or ['Pinchas'] or ['Matot','Masei']
 */
export function lookupParsha(parsha: string | string[]): ParshaMeta {
  const name = parshaToString(parsha);
  const raw = parshiyotObj[name];
  if (typeof raw !== 'object') {
    throw new TypeError(`Bad parsha argument: ${parsha}`);
  }
  if (raw.combined) {
    const [p1, p2] = name.split('-');
    if (!raw.hebrew) {
      raw.hebrew = Locale.gettext(p1, 'he') + '־' + Locale.gettext(p2, 'he');  
    }
    if (!raw.haft) {
      const haftKey = p1 === 'Nitzavim' ? p1 : p2;
      raw.haft = lookupParsha(haftKey).haft;  
    }
  }
  return raw as ParshaMeta;
}
