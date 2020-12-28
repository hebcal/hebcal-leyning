/// <reference types="node"/>

import {Event} from '@hebcal/core';
import {WriteStream} from 'fs';

declare module '@hebcal/leyning' {
    /**
     * Represents an aliyah
     * @property k - Book (e.g. "Numbers")
     * @property b - beginning verse (e.g. "28:9")
     * @property e - ending verse (e.g. "28:15")
     * @property [v] - number of verses
     * @property [p] - parsha number (1=Bereshit, 54=Vezot HaBracha)
     */
    export type Aliyah = {
        k: string;
        b: string;
        e: string;
        v?: number;
        p?: number;
    };

    export type AliyotMap = {
        [key: string]: Aliyah;
    }

    /**
     * Leyning for a parsha hashavua or holiday
     * @property haftara - Haftarah
     * @property sephardic - Haftarah for Sephardic
     */
    export type Leyning = {
        summary: string;
        haftara: string;
        sephardic?: string;
        fullkriyah: AliyotMap;
        reason?: {
            [key: string]: string;
        };
    };

    /**
     * Represents triennial aliyot for a given date
     * @property aliyot - a map of aliyot 1-7 plus "M"
     * @property yearNum - year number, 0-2
     * @property date - Shabbat date for when this parsha is read in this 3-year cycle
     * @property [readSeparately] - true if a double parsha is read separately in year `yearNum`
     * @property [date1] - Shabbat date of the first part of a read-separately aliyah pair
     * @property [date2] - Shabbat date of the second part of a read-separately aliyah pair
     */
    export type TriennialAliyot = {
        aliyot: AliyotMap;
        yearNum: number;
        date: Date;
        readSeparately?: boolean;
        date1?: Date;
        date2?: Date;
    };

    /**
     * Based on the event date, type and title, finds the relevant leyning key
     * @param e - event
     * @param [il] - true if Israel holiday scheme
     * @returns key to look up in holiday-reading.json
     */
    export function getLeyningKeyForEvent(e: Event, il?: boolean): string;

    /**
     * Looks up leyning for a given holiday. Returns some
     * of full kriyah aliyot, special Maftir, special Haftarah
     * @param e - the Hebcal event associated with this leyning
     * @param [il] - true if Israel holiday scheme
     * @returns map of aliyot
     */
    export function getLeyningForHoliday(e: Event, il?: boolean): Leyning;

    /**
     * Looks up leyning for a given holiday key. Key should be an
     * (untranslated) string used in holiday-readings.json. Returns some
     * of full kriyah aliyot, special Maftir, special Haftarah
     * @param key - name from `holiday-readings.json` to find
     * @returns map of aliyot
     */
    export function getLeyningForHolidayKey(key: string): Leyning;

    /**
     * Looks up leyning for a regular Shabbat parsha.
     * @param e - the Hebcal event associated with this leyning
     * @param [il] - in Israel
     * @returns map of aliyot
     */
    export function getLeyningForParshaHaShavua(e: Event, il?: boolean): Leyning;

    /**
     * Formats an aliyah object like "Numbers 28:9 - 28:15"
     * @param a - aliyah
     */
    export function formatAliyahWithBook(a: Aliyah): string;

    /**
     * Triennial Torah readings
     */
    export class Triennial {
        constructor(hebrewYear: number);
        getReading(parsha: string, yearNum: number): TriennialAliyot;
        getStartYear(): number;
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
     * @param [context] returns a reading wrapper object which includes `date`, `yearNum` and `aliyot`
     * @returns a map of aliyot 1-7 plus "M"
     */
    export function getTriennialForParshaHaShavua(ev: Event, context?: boolean): AliyotMap|TriennialAliyot;

    export const parshiyot: any;
    export const holidayReadings: any;

    export function writeTriennialCsv(stream: WriteStream, hyear: number): void;
    export function writeFullKriyahCsv(stream: WriteStream, hyear: number, il: boolean): void;

    /**
     * Makes Sefaria links by adding `href`, `verses` and `num` attributes to each aliyah.
     * CAUTION: Modifies the `aliyot` parameter instead of making a copy.
     * @param aliyot - aliyah map to decorate
     * @param showBook - display the book name in the `verses` field (e.g. for special Maftir)
     */
    export function addSefariaLinksToLeyning(aliyot: AliyotMap, showBook: boolean): void;
}
