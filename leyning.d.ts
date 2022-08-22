/// <reference types="node"/>

import {Event, HDate} from '@hebcal/core';
import {WriteStream} from 'fs';

declare module '@hebcal/leyning' {
    /**
     * Represents an aliyah
     */
    export type Aliyah = {
        /** Book (e.g. "Numbers") */
        k: string;
        /** beginning verse (e.g. "28:9") */
        b: string;
        /** ending verse (e.g. "28:15") */
        e: string;
        /** number of verses */
        v?: number;
        /** parsha number (1=Bereshit, 54=Vezot HaBracha) */
        p?: number;
    };

    export type AliyotMap = {
        [key: string]: Aliyah;
    }

    /**
     * Leyning for a parsha hashavua or holiday
     */
    export type Leyning = {
        /** Name of the parsha hashavua or holiday */
        name: {
            /** English */
            en: string;
            /** Hebrew (with nikud) */
            he: string;
        };
        /** An array of either 1 (regular) or 2 (doubled parsha). `undefined` for holiday readings */
        parsha?: string[];
        /** 1 for Bereshit, 2 for Noach, etc. `undefined` for holiday readings */
        parshaNum?: number;
        /** Such as `Genesis 1:1 - 6:8` */
        summary: string;
        /** Haftarah object */
        haft: Aliyah | Aliyah[];
        /** Haftarah, such as `Isaiah 42:5 – 43:11` */
        haftara: string;
        /** Number of verses in the Haftarah */
        haftaraNumV?: number;
        /** Haftarah object */
        seph?: Aliyah | Aliyah[];
        /** Haftarah for Sephardim, such as `Isaiah 42:5 - 42:21` */
        sephardic?: string;
        /** Number of verses in the Haftarah for Sephardim */
        sephardicNumV?: number;
        /** Map of aliyot `1` through `7` plus `M` for maftir */
        fullkriyah: AliyotMap;
        /** Optional map of weekday Torah Readings aliyot `1` through `3` for Monday and Thursday */
        weekday?: AliyotMap;
        /** Explanations for special readings, keyed by aliyah number, `M` for maftir or `haftara` for Haftarah */
        reason?: {
            [key: string]: string;
        };
    };

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
     * @param hdate Hebrew Date
     * @param il in Israel
     * @returns map of aliyot
     */
    export function getLeyningOnDate(hdate: HDate, il: boolean): Leyning;

    /**
     * Makes a summary of the leyning, like "Genesis 6:9-11:32"
     */
    export function makeLeyningSummary(aliyot: AliyotMap): string;

    /**
     * Based on the event date, type and title, finds the relevant leyning key
     * @param ev - the Hebcal holiday event
     * @param [il] - true if Israel holiday scheme
     * @returns key to look up in holiday-reading.json
     */
    export function getLeyningKeyForEvent(ev: Event, il?: boolean): string;

    /**
     * Looks up leyning for a given holiday. Returns some
     * of full kriyah aliyot, special Maftir, special Haftarah
     * @param ev - the Hebcal event associated with this leyning
     * @param [il] - true if Israel holiday scheme
     * @returns map of aliyot
     */
    export function getLeyningForHoliday(ev: Event, il?: boolean): Leyning;

    /**
     * Looks up leyning for a given holiday key. Key should be an
     * (untranslated) string used in holiday-readings.json. Returns some
     * of full kriyah aliyot, special Maftir, special Haftarah
     * @param key - name from `holiday-readings.json` to find
     * @returns map of aliyot
     */
    export function getLeyningForHolidayKey(key: string): Leyning;

    /**
     * Looks up leyning for a regular Shabbat parsha, including any special
     * maftir or Haftara.
     * @param ev - the Hebcal event associated with this leyning
     * @param [il] - in Israel
     * @returns map of aliyot
     */
    export function getLeyningForParshaHaShavua(ev: Event, il?: boolean): Leyning;

    /**
     * Looks up regular leyning for a weekly parsha with no special readings
     * @param parsha untranslated name like 'Pinchas' or ['Pinchas'] or ['Matot','Masei']
     * @returns map of aliyot
     */
     export function getLeyningForParsha(parsha: string|string[]): Leyning;

    /**
     * Formats an aliyah object like "Numbers 28:9 - 28:15"
     */
    export function formatAliyahWithBook(aliyah: Aliyah): string;

    /**
     * Formats an aliyah object like "Numbers 28:9-15"
     */
    export function formatAliyahShort(aliyah: Aliyah, showBook: boolean): string;

    /**
     * Represents triennial aliyot for a given date
     */
    export type TriennialAliyot = {
        /** Map of aliyot `1` through `7` plus `M` for maftir */
        aliyot: AliyotMap;
        /** year number, 0-2 */
        yearNum: number;
        /** Shabbat date for when this parsha is read in this 3-year cycle */
        date: Date;
        /** true if a double parsha is read separately in year `yearNum` */
        readSeparately?: boolean;
        /** Shabbat date of the first part of a read-separately aliyah pair */
        date1?: Date;
        /** Shabbat date of the second part of a read-separately aliyah pair */
        date2?: Date;
    };

    /**
     * Triennial Torah readings
     */
    export class Triennial {
        constructor(hebrewYear: number);
        getReading(parsha: string, yearNum: number): TriennialAliyot;
        getStartYear(): number;
        debug(): string;
        /**
         * Returns triennial year 1, 2 or 3 based on this Hebrew year
         * @param year Hebrew year
         */
        static getYearNumber(year: number): number;
        /**
         * Returns Hebrew year that this 3-year triennial cycle began
         * @param year Hebrew year
         */
        static getCycleStartYear(year: number): number;
    }

    /**
     * Calculates the 3-year readings for a given year
     * @param year - Hebrew year
     */
    export function getTriennial(year: number): Triennial;

    /**
     * Looks up triennial leyning for a regular Shabbat parsha.
     * @param ev - the Hebcal event associated with this parsha
     * @returns a map of aliyot 1-7 plus "M"
     */
    export function getTriennialForParshaHaShavua(ev: Event): TriennialAliyot;

    export function getTriennialHaftaraForHoliday(holiday: string, yearNum: number): any;

    /**
     * Names of the books of the Torah. BOOK[1] === 'Genesis'
     */
    export const BOOK: string[];

    export function writeTriennialCsv(stream: WriteStream, hyear: number): void;
    export function writeFullKriyahCsv(stream: WriteStream, hyear: number, il: boolean): void;
}
