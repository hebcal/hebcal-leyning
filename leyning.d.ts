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
        reason?: any;
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
        getReading(name: string, yearNum: number): any;
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
     * @param e - the Hebcal event associated with this parsha
     * @returns map of aliyot
     */
    export function getTriennialForParshaHaShavua(e: Event): AliyotMap;

    export const parshiyot: any;
    export const holidayReadings: any;

    export function writeTriennialCsv(stream: WriteStream, hyear: number): void;
    export function writeFullKriyahCsv(stream: WriteStream, hyear: number, il: boolean): void;
}
