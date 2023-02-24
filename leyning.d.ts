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

    export type StringMap = {
        [key: string]: string;
    }

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
        reason?: StringMap;
        /** Song of Songs is read on the sabbath of Passover week, the Book of Ruth on Shavuot, Lamentations on Tisha be-Av, Ecclesiastes on the sabbath of the week of Sukkoth, and the Book of Esther on Purim */
        megillah?: AliyotMap;
    };

    /**
     * Formats parsha as a string
     */
    export function parshaToString(parsha: string[]): string;
    /**
     * Makes a deep copy of the src object using JSON stringify and parse
     */
    export function clone(src: any): any;
    /**
     * Calculates the number of verses in an aliyah or haftara based on
     * the `b` (begin verse), `e` (end verse) and `k` (book).
     * Modifies `aliyah` by setting the `v` field.
     */
    export function calculateNumVerses(aliyah: Aliyah): number;
    /**
     * Returns the total number of verses in an array of Aliyah (or haftarah) objects
     */
    export function sumVerses(aliyot: Aliyah | Aliyah[]): number;
    /**
     * Summarizes an `AliyotMap` by collapsing all adjacent aliyot.
     * Finds any non-overlapping parts (e.g. special 7th aliyah or maftir)
     */
    export function makeLeyningParts(aliyot: AliyotMap): Aliyah[];
     /**
      * Returns a string representation of the leyning parts.
      * Separate verse ranges read from the same book are separated
      * by commas, e.g. `Isaiah 6:1-7:6, 9:5-6`.
      * Verse ranges from different books are separated by semicolons,
      * e.g. `Genesis 21:1-34; Numbers 29:1-6`.
      */
    export function makeSummaryFromParts(parts: Aliyah | Aliyah[]): string;
    export type SpecialReading = {
        aliyot: AliyotMap;
        reason: StringMap;
        haft: Aliyah | Aliyah[];
        seph?: Aliyah | Aliyah[];
    };
    /**
     * Determines if the regular parashat haShavua coincides with an event that requires
     * a special maftir or Haftara (for example Shabbat HaGadol, Shabbat Chanukah, Rosh
     * Chodesh or Machar Chodesh, etc.).
     *
     * If a special maftir occurs, modifies `aliyot` to replace `M` and sets `reason.M`
     * (and in some cases modifies the 6th and 7th aliyah, setting `reason['7']`).
     *
     * If a special Haftarah applies, returns the Haftarah object and sets `reason.haftara`.
     * If no special Haftarah, returns `undefined`
     */
    export function specialReadings2(parsha: string[], hd: HDate, il: boolean, aliyot: AliyotMap): SpecialReading;
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
     * @param wantarray to return an array of 0 or more readings
     * @returns map of aliyot
     */
    export function getLeyningOnDate(hdate: HDate, il: boolean, wantarray?: boolean): Leyning | Leyning[];

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
     * Looks up Monday/Thursday aliyot for a regular parsha
     * @param parsha untranslated name like 'Pinchas' or ['Pinchas'] or ['Matot','Masei']
     * @returns map of aliyot
     */
    export function getWeekdayReading(parsha: string|string[]): AliyotMap;

    /**
     * Formats an aliyah object like "Numbers 28:9 - 28:15"
     */
    export function formatAliyahWithBook(aliyah: Aliyah): string;

    /**
     * Formats an aliyah object like "Numbers 28:9-15"
     */
    export function formatAliyahShort(aliyah: Aliyah, showBook: boolean): string;

    /**
     * Names of the books of the Torah. BOOK[1] === 'Genesis'
     */
    export const BOOK: string[];

    export function writeFullKriyahCsv(stream: WriteStream, hyear: number, il: boolean): void;
    /**
     * Formats reading for CSV
     */
    export function writeCsvLines(stream: WriteStream, ev: Event, reading: Leyning, il: boolean, isParsha: boolean): void;

    export function writeHolidayMincha(stream: WriteStream, ev: Event, il: boolean): void;

    export interface StringToBoolMap {
        [key: string]: boolean;
    }
    export function getParshaDates(events: Event[]): StringToBoolMap;

    /**
     * Parsha metadata (underlying JSON object)
     */
    export type ParshaMeta = {
        /** 1 for Bereshit, 2 for Noach, etc. `undefined` for holiday readings */
        num: number;
        /** parsha name in Hebrew with niqud */
        hebrew: string;
        /** 1 for Genesis, 2 for Exodus, 5 for Deuteronomy */
        book: number;
        /** Haftarah object(s) */
        haft: Aliyah | Aliyah[];
        /** Haftarah object(s) for Sephardim */
        seph?: Aliyah | Aliyah[];
        /** Raw map of Shabbat aliyot `1` through `7` plus `M` for maftir */
        fullkriyah: {
            [key: string]: string[];
        };
        /** weekday - raw map of weekday Torah Readings aliyot `1` through `3` for Mon & Thu */
        weekday: {
            [key: string]: string[];
        };
    };

    /**
     * Returns raw parsha metadata
     */
    export function lookupParsha(parsha: string | string[]): ParshaMeta;

    /**
     * Is there a special festival Torah Reading for `holiday`?
     */
    export function hasFestival(holiday: string): boolean;
  
    /**
     * Returns the raw metadata for festival reading for `holiday`
     */
    export function lookupFestival(holiday: string): any;  
}
