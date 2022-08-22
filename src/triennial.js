import {Event, HDate, HebrewCalendar, parshiot, flags, months} from '@hebcal/core';
import {specialReadings} from './specialReadings';
import triennialConfig from './triennial.json';
import {BOOK, calculateNumVerses, clone, shallowCopy,
  cloneHaftara, makeHaftaraSummary, calculateHaftaraNumV,
  parshaToString} from './common';
import triennialHaft from './triennial-haft.json';

/**
 * Represents triennial aliyot for a given date
 * @typedef {Object} TriennialAliyot
 * @property {Object<string,Aliyah>} aliyot - a map of aliyot 1-7 plus "M"
 * @property {number} yearNum - year number, 0-2
 * @property {Date} date - Shabbat date for when this parsha is read in this 3-year cycle
 * @property {boolean} [readSeparately] - true if a double parsha is read separately in year `yearNum`
 * @property {Date} [date1] - Shabbat date of the first part of a read-separately aliyah pair
 * @property {Date} [date2] - Shabbat date of the second part of a read-separately aliyah pair
 */

const VEZOT_HABERAKHAH = 'Vezot Haberakhah';
const isSometimesDoubled = Object.create(null);
// N.B. these are 0-based indices
const doubled = [
  21, // Vayakhel-Pekudei
  26, // Tazria-Metzora
  28, // Achrei Mot-Kedoshim
  31, // Behar-Bechukotai
  38, // Chukat-Balak
  41, // Matot-Masei
  50, // Nitzavim-Vayeilech
];
doubled.forEach((id) => {
  isSometimesDoubled[id] = true;
  isSometimesDoubled[id + 1] = true;
});

/**
 * takes a 0-based (Bereshit=0) parsha ID
 * @private
 * @param {number} id
 * @return {string}
 */
function getDoubledName(id) {
  const p1 = parshiot[id];
  const p2 = parshiot[id + 1];
  const name = p1 + '-' + p2;
  return name;
}

let triennialAliyot;

/** Triennial Torah readings */
export class Triennial {
  /**
   * Builds a Triennial object
   * @param {number} [hebrewYear] Hebrew Year (default current year)
   */
  constructor(hebrewYear) {
    hebrewYear = hebrewYear || new HDate().getFullYear();
    if (hebrewYear < 5744) {
      throw new RangeError(`Invalid Triennial year ${hebrewYear}`);
    }
    if (!triennialAliyot) {
      triennialAliyot = Triennial.getTriennialAliyot();
    }

    this.startYear = Triennial.getCycleStartYear(hebrewYear);
    this.sedraArray = [];
    this.bereshit = Array(4);
    for (let yr = 0; yr < 4; yr++) {
      const sedra = HebrewCalendar.getSedra(this.startYear + yr, false);
      const arr = sedra.getSedraArray();
      this.bereshit[yr] = this.sedraArray.length + arr.indexOf(0);
      this.sedraArray = this.sedraArray.concat(arr);
    }
    // find the first Saturday on or after Rosh Hashana
    const rh = new HDate(1, months.TISHREI, this.startYear);
    const firstSaturday = rh.onOrAfter(6);
    this.firstSaturday = firstSaturday.abs();
    this.calcVariationOptions();
    this.readings = this.cycleReadings(this.variationOptions);
  }

  /**
   * @param {string} parsha parsha name ("Bereshit" or "Achrei Mot-Kedoshim")
   * @param {number} yearNum 0 through 2 for which year of Triennial cycle
   * @return {Object<string,Aliyah>} a map of aliyot 1-7 plus "M"
   */
  getReading(parsha, yearNum) {
    const reading = shallowCopy({}, this.readings[parsha][yearNum]);
    if (reading.aliyot) {
      Object.values(reading.aliyot).map((aliyah) => calculateNumVerses(aliyah));
    }
    return reading;
  }

  /**
   * @return {number}
   */
  getStartYear() {
    return this.startYear;
  }

  /**
   * Returns triennial year 1, 2 or 3 based on this Hebrew year
   * @param {number} year Hebrew year
   * @return {number}
   */
  static getYearNumber(year) {
    if (year < 5744) {
      throw new RangeError(`Invalid Triennial year ${year}`);
    }
    return ((year - 5744) % 3) + 1;
  }

  /**
   * Returns Hebrew year that this 3-year triennial cycle began
   * @param {number} year Hebrew year
   * @return {number}
   */
  static getCycleStartYear(year) {
    return year - (this.getYearNumber(year) - 1);
  }

  /**
   * First, determine if a doubled parsha is read [T]ogether or [S]eparately
   * in each of the 3 years. Yields a pattern like 'SSS', 'STS', 'TTT', 'TTS'.
   * @private
   * @param {number} id
   * @return {string}
   */
  getThreeYearPattern(id) {
    let pattern = '';
    for (let yr = 0; yr <= 2; yr ++) {
      let found = this.sedraArray.indexOf(-1 * id, this.bereshit[yr]);
      if (found > this.bereshit[yr + 1]) {
        found = -1;
      }
      const pat = (found == -1) ? 'S' : 'T';
      pattern += pat;
    }
    return pattern;
  }

  /**
   * @private
   */
  calcVariationOptions() {
    const option = this.variationOptions = Object.create(null);
    doubled.forEach((id) => {
      const pattern = this.getThreeYearPattern(id);
      const name = getDoubledName(id);
      // Next, look up the pattern in JSON to determine readings for each year.
      // For "all-together", use "Y" pattern to imply Y.1, Y.2, Y.3
      const variation = (pattern === 'TTT') ?
        'Y' :
        triennialConfig[name].patterns[pattern];
      if (typeof variation === 'undefined') {
        throw new Error(`Can't find pattern ${pattern} for ${name}, startYear=${this.startYear}`);
      }
      const p1 = parshiot[id];
      const p2 = parshiot[id + 1];
      option[name] = option[p1] = option[p2] = variation;
    });
  }

  /**
   * @return {string}
   */
  debug() {
    let str = `Triennial cycle started year ${this.startYear}\n`;
    doubled.forEach((id) => {
      const pattern = this.getThreeYearPattern(id);
      const name = getDoubledName(id);
      const variation = this.variationOptions[name];
      str += `  ${name} ${pattern} (${variation})\n`;
    });
    return str;
  }

  /**
   * Builds a lookup table readings["Bereshit"][0], readings["Matot-Masei"][2]
   * @private
   * @param {Object} cycleOption
   * @return {Map<string,Object[]>}
   */
  cycleReadings(cycleOption) {
    const readings = Object.create(null);
    parshiot.forEach((parsha) => {
      readings[parsha] = Array(3);
    });
    readings[VEZOT_HABERAKHAH] = Array(3);
    doubled.map(getDoubledName).forEach((parsha) => {
      readings[parsha] = Array(3);
    });
    for (let yr = 0; yr <= 2; yr ++) {
      this.cycleReadingsForYear(cycleOption, readings, yr);
    }
    return readings;
  }

  /**
   * @private
   * @param {string} option
   * @param {Map<string,Object[]>} readings
   * @param {number} yr
  */
  cycleReadingsForYear(option, readings, yr) {
    const startIdx = this.bereshit[yr];
    const endIdx = this.bereshit[yr + 1];
    for (let i = startIdx; i < endIdx; i++) {
      const id = this.sedraArray[i];
      if (typeof id !== 'number') {
        continue;
      }
      const h = (id < 0) ? getDoubledName(-id) : parshiot[id];
      const variationKey = isSometimesDoubled[id] ? option[h] : 'Y';
      const variation = variationKey + '.' + (yr + 1);
      const a = triennialAliyot[h][variation];
      if (!a) {
        throw new Error(`can't find ${h} year ${yr} (variation ${variation})`);
      }
      const aliyot = clone(a);
      // calculate numVerses for the subset of aliyot that don't cross chapter boundaries
      Object.keys(aliyot).forEach((num) => calculateNumVerses(aliyot[num]));
      readings[h][yr] = {
        aliyot,
        date: new HDate(this.firstSaturday + (i * 7)),
      };
    }
    // create links for doubled
    doubled.forEach((id) => {
      const h = getDoubledName(id);
      const combined = readings[h][yr];
      const p1 = parshiot[id];
      const p2 = parshiot[id + 1];
      if (combined) {
        readings[p1][yr] = readings[p2][yr] = {readTogether: h, date: combined.date};
      } else {
        readings[h][yr] = {
          readSeparately: true,
          date1: readings[p1][yr].date,
          date2: readings[p2][yr].date,
        };
      }
    });
    const vezotAliyot = triennialAliyot[VEZOT_HABERAKHAH]['Y.1'];
    readings[VEZOT_HABERAKHAH][yr] = {
      aliyot: vezotAliyot,
      date: new HDate(23, months.TISHREI, this.startYear + yr),
    };
  }

  /**
   * Walks triennialConfig and builds lookup table for triennial aliyot
   * @private
   * @return {Object}
   */
  static getTriennialAliyot() {
    const triennialAliyot = Object.create(null);
    const triennialAliyotAlt = Object.create(null);
    // build a lookup table so we don't have to follow num/variation/sameas
    Object.keys(triennialConfig).forEach((parsha) => {
      const value = triennialConfig[parsha];
      if (typeof value !== 'object' || typeof value.book !== 'number') {
        throw new Error(`misconfiguration: ${parsha}`);
      }
      const book = BOOK[value.book];
      triennialAliyot[parsha] = Triennial.resolveSameAs(parsha, book, value);
      if (value.alt) {
        triennialAliyotAlt[parsha] = Triennial.resolveSameAs(parsha, book, value.alt);
      }
    });
    // TODO: handle triennialAliyotAlt also
    return triennialAliyot;
  }

  /**
   * Transforms input JSON with sameAs shortcuts like "D.2":"A.3" to
   * actual aliyot objects for a given variation/year
   * @private
   * @param {string} parsha
   * @param {string} book
   * @param {Object} triennial
   * @return {Object}
   */
  static resolveSameAs(parsha, book, triennial) {
    const variations = triennial.years || triennial.variations;
    if (typeof variations === 'undefined') {
      throw new Error(`Parashat ${parsha} has no years or variations`);
    }
    // first pass, copy only alyiot definitions from triennialConfig into lookup table
    const lookup = Object.create(null);
    Object.keys(variations).forEach((variation) => {
      const aliyot = variations[variation];
      if (typeof aliyot === 'object') {
        const dest = {};
        Object.keys(aliyot).forEach((num) => {
          const src = aliyot[num];
          const reading = {k: book, b: src[0], e: src[1]};
          if (src.v) {
            reading.v = src.v;
          }
          dest[num] = reading;
        });
        lookup[variation] = dest;
      }
    });
    // second pass to resolve sameas strings (to simplify later lookups)
    Object.keys(variations).forEach((variation) => {
      const aliyot = variations[variation];
      if (typeof aliyot === 'string') {
        if (typeof lookup[aliyot] === 'undefined') {
          throw new Error(`Can't find source for ${parsha} ${variation} sameas=${aliyot}`);
        }
        lookup[variation] = lookup[aliyot];
      }
    });
    return lookup;
  }
}

const __cache = Object.create(null);

/**
 * Calculates the 3-year readings for a given year
 * @param {number} year Hebrew year
 * @return {Triennial}
 */
export function getTriennial(year) {
  const cycleStartYear = Triennial.getCycleStartYear(year);
  const cached = __cache[cycleStartYear];
  if (cached) {
    return cached;
  }
  const tri = new Triennial(cycleStartYear);
  __cache[cycleStartYear] = tri;
  return tri;
}

/**
 * Looks up the triennial leyning for this Parashat HaShavua
 * @param {Event} ev
 * @return {TriennialAliyot} a map of aliyot 1-7 plus "M"
 */
export function getTriennialForParshaHaShavua(ev) {
  if (!ev instanceof Event) {
    throw new TypeError(`Bad event argument: ${ev}`);
  } else if (ev.getFlags() != flags.PARSHA_HASHAVUA) {
    throw new TypeError(`Event must be parsha hashavua: ${ev.getDesc()}`);
  }
  const hd = ev.getDate();
  const hyear0 = hd.getFullYear();
  const parsha = ev.parsha;
  // When Nitzavim & Vayeilech are not combined, they should each be read in their entirety.
  // Vayeilech can occur immediately after RH, so back up one year to pick up
  // the tail end of previous 3-year cycle.
  const p1 = parsha[0];
  const hyear = (p1 === 'Vayeilech' && hd.getMonth() === months.TISHREI) ? hyear0 - 1 : hyear0;
  const triennial = getTriennial(hyear);
  const startYear = triennial.getStartYear();
  const yearNum = hyear - startYear;
  const name = parshaToString(parsha); // untranslated
  const reading = triennial.getReading(name, yearNum);
  if (typeof reading !== 'object') {
    throw new ReferenceError(`Can't load reading for ${name} in ${hyear} (year number ${yearNum})`);
  }
  const aliyotMap = shallowCopy({}, reading.aliyot);
  // possibly replace 7th aliyah and/or maftir
  const reason = {};
  specialReadings(hd, false, aliyotMap, reason);
  Object.keys(reason).forEach((num) => {
    const aliyah = aliyotMap[num];
    if (typeof aliyah === 'object') {
      aliyah.reason = reason[num];
    }
  });
  reading.yearNum = yearNum;
  reading.aliyot = aliyotMap;
  const triHaft = getTriennialHaftara(parsha, yearNum);
  shallowCopy(reading, triHaft);
  return reading;
}

/**
 * Looks up the alternative triennial Haftara for a given parsha
 *
 * INSTRUCTIONS REGARDING DOUBLE PARSHIYOT
 *
 * In any 3 year sequence, in some years these parshiyot are read together
 * and in some they are read separately.
 * When separated: read the next haftarah of the parashah being read.
 * When together: when reading the first third, read the next haftarah
 * of the first parashah, when reading the latter two thirds, read the
 * next haftarah of the latter parashah
 * @private
 * @param {string[]} parsha
 * @param {number} yearNum 0, 1, or 2
 * @return {Object}
 */
export function getTriennialHaftara(parsha, yearNum) {
  const idx = (parsha.length === 1 || yearNum === 0) ? 0 : 1;
  const name = parsha[idx];
  const triHaft = triennialHaft[name];
  const triHaft2 = triHaft?.[yearNum + 1];
  if (typeof triHaft2 === 'object') {
    const haft = cloneHaftara(triHaft2);
    return {
      haft: haft,
      haftara: makeHaftaraSummary(haft),
      haftaraNumV: calculateHaftaraNumV(haft),
    };
  }
  return {};
}

/**
 * Looks up the alternative triennial Haftara for a holiday
 * @param {string} key
 * @param {number} yearNum
 * @return {Object}
 */
export function getTriennialHaftaraForHoliday(key, yearNum) {
  if (key === 'Tish\'a B\'Av') {
    return getTriennialHaftara([key], yearNum);
  }
  const triHaft2 = triennialHaft._holidays[key];
  if (typeof triHaft2 === 'object') {
    const haft = cloneHaftara(triHaft2);
    return {
      haft: haft,
      haftara: makeHaftaraSummary(haft),
      haftaraNumV: calculateHaftaraNumV(haft),
    };
  }
  return undefined;
}
