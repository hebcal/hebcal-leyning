import {Event} from '@hebcal/core/dist/esm/event';
import {ParshaEvent} from '@hebcal/core/dist/esm/ParshaEvent';
import {Locale} from './locale.js';
import parshiyotObj0 from './aliyot.json.js';
import {BOOK, calculateNumVerses, parshaToString} from './common.js';
import {translateAliyahOrArray, translateLeyning} from './translate.js';
import {makeLeyningParts, makeSummaryFromParts} from './summary.js';
import {cloneHaftara, sumVerses} from './clone.js';
import {specialReadings2} from './specialReadings.js';
import {lookupFestival} from './festival.js';
import {
  Aliyah,
  AliyotMap,
  HaftTheme,
  Leyning,
  LeyningNames,
  ParshaMeta,
} from './types.js';

type JsonParshaMap = Record<string, string[]>;

/** Shape of a single entry in `aliyot.json` */
type JsonParsha = {
  num: number | number[];
  book: number;
  haft?: Aliyah | Aliyah[];
  seph?: Aliyah | Aliyah[];
  chabad?: Aliyah | Aliyah[] | {sameas: 'haft'};
  haftTheme?: HaftTheme;
  fullkriyah: JsonParshaMap;
  weekday?: JsonParshaMap;
  combined?: boolean;
  p1?: string;
  p2?: string;
  num1?: number;
  num2?: number;
};

type Parshiyot = Record<string, JsonParsha>;

const parshiyotObj = parshiyotObj0 as Parshiyot;

/**
 * on doubled parshiot, read only the second Haftarah
 * except for Nitzavim-Vayelech and Achrei Mot-Kedoshim
 * @private
 */
function getHaftaraKey(parsha: string[]): string {
  const first = parsha[0];
  if (parsha.length === 2 && first === 'Achrei Mot') {
    return parshaToString(parsha); // 'Achrei Mot-Kedoshim'
  }
  if (parsha.length === 1 || first === 'Nitzavim') {
    return first;
  } else {
    return parsha[1];
  }
}

/**
 * Builds the transliterated English and Hebrew names for a parsha.
 * @param parsha untranslated parsha name(s), e.g. `['Pinchas']` or
 *   `['Matot', 'Masei']` for a doubled parsha
 * @returns object with the `en` name and `he` name (Hebrew with nikud)
 */
export function makeLeyningNames(parsha: string[]): LeyningNames {
  const name = parshaToString(parsha);
  return {
    en: name,
    he: parsha.map(s => Locale.lookupTranslation(s, 'he')).join('־'),
  };
}

/**
 * Looks up regular leyning for a weekly parsha with no special readings
 * @private
 * @param parsha untranslated name like 'Pinchas' or ['Pinchas'] or ['Matot','Masei']
 * @returns map of aliyot
 */
function getLeyningForParshaShabbatOnly(
  parsha: string | string[],
  language: string = 'en'
): Leyning {
  const raw = lookupParsha(parsha);
  const fullkriyah: AliyotMap = {};
  const book = BOOK[raw.book];
  for (const [num, src] of Object.entries(raw.fullkriyah)) {
    const aliyah: Aliyah = {k: book, b: src[0], e: src[1]};
    if (src.length === 3) {
      aliyah.reason = src[2];
    }
    calculateNumVerses(aliyah);
    fullkriyah[num] = aliyah;
  }
  const name = parshaToString(parsha);
  const parshaNameArray: string[] = raw.combined ? [raw.p1!, raw.p2!] : [name];
  const parts = makeLeyningParts(fullkriyah);
  const summary = makeSummaryFromParts(parts);
  const result: Leyning = {
    name: makeLeyningNames(parshaNameArray),
    type: 'shabbat',
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
    const haft = (result.haft = cloneHaftara(haft0));
    result.haftara = makeSummaryFromParts(haft);
    result.haftaraNumV = sumVerses(haft);
  }
  const seph0 = parshiyotObj[hkey].seph;
  if (seph0) {
    const seph = (result.seph = cloneHaftara(seph0));
    result.sephardic = makeSummaryFromParts(seph);
    result.sephardicNumV = sumVerses(seph);
  }
  const chabad = parshiyotObj[hkey].chabad;
  if (chabad) {
    if ('sameas' in chabad) {
      result.chabad = result.haft;
    } else {
      result.chabad = cloneHaftara(chabad);
    }
  }
  return translateLeyning(result, language);
}

/**
 * Looks up the weekday (Monday & Thursday) Torah reading for a regular parsha.
 *
 * These are the abbreviated three-aliyah readings chanted on weekday
 * mornings, drawn from the beginning of the upcoming Shabbat parsha.
 * @param parsha untranslated name, e.g. `'Pinchas'`, `['Pinchas']`, or
 *   `['Matot', 'Masei']` for a doubled parsha
 * @param [language] language for book names (default `'en'`)
 * @returns map of aliyot keyed by `'1'` through `'3'`
 */
export function getWeekdayReading(
  parsha: string | string[],
  language: string = 'en'
): AliyotMap {
  const raw = lookupParsha(parsha);
  const parshaMeta = raw.combined ? lookupParsha(raw.p1!) : raw;
  const aliyot = parshaMeta.weekday;
  if (!aliyot) {
    throw new Error(`Parsha missing weekday: ${parsha}`);
  }
  const book = BOOK[raw.book];
  const weekday: AliyotMap = {};
  for (let i = 1; i <= 3; i++) {
    const num = String(i);
    const src = aliyot[num];
    const aliyah: Aliyah = {k: book, b: src[0], e: src[1]};
    calculateNumVerses(aliyah);
    weekday[num] = aliyah;
  }
  return translateAliyahOrArray(weekday, language);
}

/**
 * Looks up the leyning for a regular parsha, ignoring any special occasion.
 *
 * Unlike {@link getLeyningForParshaHaShavua}, this takes a bare parsha name
 * rather than a dated event and applies no special maftir/Haftarah overrides,
 * so it is date-independent. The result includes both the Shabbat
 * `fullkriyah` and the `weekday` reading.
 * @param parsha untranslated name, e.g. `'Pinchas'`, `['Pinchas']`, or
 *   `['Matot', 'Masei']` for a doubled parsha
 * @param [language] language for names and summary (default `'en'`)
 * @returns the complete leyning for this parsha
 */
export function getLeyningForParsha(
  parsha: string | string[],
  language: string = 'en'
): Leyning {
  const result = getLeyningForParshaShabbatOnly(parsha, language);
  result.weekday = getWeekdayReading(parsha);
  return result;
}

const reasonHaftKey: Partial<Record<string, 'haft' | 'seph' | 'chabad'>> = {
  haftara: 'haft',
  sephardic: 'seph',
  chabad: 'chabad',
};

/**
 * Returns the theme of the Haftarah tied to the weeks around Tish'a B'Av:
 * the number of the Haftarah of Admonition (תְּלָתָא דְּפוּרְעָנוּתָא, three
 * Shabbatot before Tish'a B'Av) or of the Haftarah of Consolation
 * (שֶׁבַע דְּנֶחָמְתָא, seven Shabbatot after Tish'a B'Av), if applicable.
 *
 * The number lives in the `haftTheme` data: on the base parsha in
 * `aliyot.json`, or — when a special reading replaces the Haftarah — on the
 * festival entry in `holiday-readings.json`. When a special reading displaces
 * the Haftarah with an unthemed one (e.g. Re'eh on Shabbat Rosh Chodesh),
 * neither has a `haftTheme` and `undefined` is returned.
 * @private
 * @param parsha untranslated name like `['Pinchas']` or `['Matot','Masei']`
 * @param haftReason untranslated `reason.haftara` key from `specialReadings2()`
 */
function getHaftarahTheme(
  parsha: string[],
  haftReason: string | undefined
): HaftTheme | undefined {
  return haftReason
    ? lookupFestival(haftReason)?.haftTheme
    : parshiyotObj[getHaftaraKey(parsha)]?.haftTheme;
}

/**
 * Looks up the leyning for a regular Shabbat parsha, applying any special
 * maftir or Haftarah that a coinciding occasion requires — Shabbat Rosh
 * Chodesh, Shabbat Chanukah, one of the four special Shabbatot, a Haftarah of
 * Admonition or Consolation, and so on.
 * @param ev the `ParshaEvent` for this Shabbat
 * @param [il] `true` for the Israel reading schedule (default `false`)
 * @param [language] language for names and summary (default `'en'`)
 * @returns the complete leyning, including `fullkriyah`, `haftara`, and any
 *   `reason` explanations for overrides
 * @throws {TypeError} if `ev` is not a parsha hashavua event
 */
export function getLeyningForParshaHaShavua(
  ev: Event,
  il = false,
  language: string = 'en'
): Leyning {
  if (typeof ev !== 'object' || typeof ev.hasFlag !== 'function') {
    throw new TypeError(`Bad event argument: ${ev}`);
  } else if (!ev.hasFlag('PARSHA_HASHAVUA')) {
    throw new TypeError(`Event must be parsha hashavua: ${ev.getDesc()}`);
  }
  // first, collect the default aliyot and haftara
  const parsha = (ev as ParshaEvent).p.parsha;
  const result = getLeyningForParshaShabbatOnly(parsha);
  const hd = ev.getDate();
  // Now, check for special maftir or haftara on same date
  const special = specialReadings2(parsha, hd, il, result.fullkriyah);
  const reason = special.reason;
  const haftTheme = getHaftarahTheme(parsha, reason.haftara);
  if (haftTheme) {
    Object.assign(result, haftTheme);
  }
  if (special.haft) {
    delete result.chabad;
    delete result.seph;
    delete result.sephardic;
    delete result.sephardicNumV;
    const haft = (result.haft = cloneHaftara(special.haft));
    result.haftara = makeSummaryFromParts(haft);
    result.haftaraNumV = sumVerses(haft);
    if (special.seph) {
      const seph = (result.seph = cloneHaftara(special.seph));
      result.sephardic = makeSummaryFromParts(seph);
      result.sephardicNumV = sumVerses(seph);
    }
    if (special.chabad) {
      result.chabad = cloneHaftara(special.chabad);
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
    // Translate reason strings to target language if not English
    const translatedReason: Record<string, string> = {};
    for (const [key, val] of Object.entries(reason)) {
      translatedReason[key] = Locale.gettext(val, language);
    }
    result.reason = translatedReason;
    for (const num of reasons) {
      const haftKey = reasonHaftKey[num];
      if (haftKey) {
        const haftObj = result[haftKey];
        const hafts: Aliyah[] = Array.isArray(haftObj) ? haftObj : [haftObj!];
        for (const haft of hafts) {
          haft.reason = translatedReason[num];
        }
      } else {
        const aliyah = result.fullkriyah[num];
        if (typeof aliyah === 'object') {
          aliyah.reason = translatedReason[num];
        }
      }
    }
  }
  return translateLeyning(result, language);
}

/**
 * Returns the raw metadata for a parsha from `aliyot.json`.
 *
 * This is the underlying data (verse tuples, book number, Haftarah theme,
 * etc.), not a computed reading — use {@link getLeyningForParsha} for that.
 * @param parsha untranslated name, e.g. `'Pinchas'`, `['Pinchas']`, or
 *   `['Matot', 'Masei']` for a doubled parsha
 * @param [language] language for the Hebrew name and Haftarah (default `'en'`)
 * @returns the parsha metadata (see {@link ParshaMeta})
 * @throws {TypeError} if `parsha` is not a known parsha name
 */
export function lookupParsha(
  parsha: string | string[],
  language: string = 'en'
): ParshaMeta {
  const name = parshaToString(parsha);
  const raw = parshiyotObj[name];
  if (typeof raw !== 'object') {
    throw new TypeError(`Bad parsha argument: ${parsha}`);
  }
  // Build a new object rather than modifying `raw`, which is shared data
  // from aliyot.json and must not be translated in place
  let hebrew: string;
  let haft = raw.haft;
  if (raw.combined) {
    const [p1, p2] = name.split('-');
    hebrew = Locale.gettext(p1, 'he') + '־' + Locale.gettext(p2, 'he');
    haft ??= lookupParsha(p1 === 'Nitzavim' ? p1 : p2).haft;
  } else {
    hebrew = Locale.gettext(name, 'he');
  }
  const {chabad, ...rest} = raw;
  const result: ParshaMeta = {
    ...rest,
    hebrew,
    haft: translateAliyahOrArray(haft!, language),
  };
  if (raw.seph) {
    result.seph = translateAliyahOrArray(raw.seph, language);
  }
  if (chabad) {
    result.chabad =
      'sameas' in chabad
        ? result.haft
        : translateAliyahOrArray(chabad, language);
  }
  return result;
}
