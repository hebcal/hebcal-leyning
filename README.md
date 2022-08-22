# @hebcal/leyning
Javascript Torah Reading API for Parashat HaShavua and holidays

[![Build Status](https://circleci.com/gh/hebcal/hebcal-leyning.svg?style=svg)](https://circleci.com/gh/hebcal/hebcal-leyning)

This package includes both traditional (full kriyah), triennial and weekday
Torah readings.

“Many congregations pattern their weekly Torah reading cycle after a system
similar to the one used in ancient Israel during the rabbinic period. In
this system, the traditional parashiot are each divided into three shorter
segments, and the whole Torah is completed once every three years. The
system has both advantages and disadvantages, but its ability to shorten
the length of Torah reading without sacrificing the complete reading of the
Torah on a regular basis has made it the choice of some synagogues in the
Conservative Movement.”

[A Complete Triennial System for Reading the Torah, Committee on Jewish Law and Standards of the Rabbinical Assembly](https://www.rabbinicalassembly.org/sites/default/files/public/halakhah/teshuvot/19861990/eisenberg_triennial.pdf)

Update December 2021: In November 2020, the CJLS modified the triennial
cycle for some combined parshiyot to change the reading for year 3 to be
the third section of the parashah.

[Modification of the Triennial Cycle Readings for Combined Parashot in Certain Years](https://www.rabbinicalassembly.org/sites/default/files/2021-09/cohen-triennial.pdf), Rabbi Miles B. Cohen

Update August 2022: Incorporated [An Emendation to Richard Eisenberg’s Complete Triennial System for Reading Torah, to Address a Rare Situation](https://www.rabbinicalassembly.org/sites/default/files/public/halakhah/teshuvot/2011-2020/heller-triennial-emendation.pdf), Rabbi Joshua Heller, 2012

## Installation
```bash
$ npm install @hebcal/leyning
```

## Synopsis
```javascript
import {HebrewCalendar, HDate, Event} from '@hebcal/core';
import {getLeyningForParshaHaShavua, getTriennialForParshaHaShavua,
 formatAliyahWithBook} from '@hebcal/leyning';

const events = HebrewCalendar.calendar({sedrot: true, noHolidays: true});
const ev = events.find((ev) => ev.getDesc() == 'Parashat Pinchas');
const reading = getLeyningForParshaHaShavua(ev);
console.log(`${ev.getDesc()}: ${reading.summary}`);
console.log(`Haftara: ${reading.haftara}`);
for (const [num, aliyah] of Object.entries(reading.fullkriyah)) {
  const number = num == 'M' ? 'maftir' : `aliyah ${num}`;
  let str = formatAliyahWithBook(aliyah);
  if (reading.reason[num]) {
      str += ' | ' + reading.reason[num];
  }
  str += ` (${aliyah.v} verses)`;
  console.log(`${number}: ${str}`);
}
const triReading = getTriennialForParshaHaShavua(ev);
for (const [num, aliyah] of Object.entries(triReading)) {
  const number = num == 'M' ? 'maftir' : `aliyah ${num}`;
  const str = formatAliyahWithBook(aliyah);
  console.log(`Triennial ${number}: ${str}`);
}
```

## Classes

<dl>
<dt><a href="#Triennial">Triennial</a></dt>
<dd><p>Triennial Torah readings</p>
</dd>
</dl>

## Constants

<dl>
<dt><a href="#BOOK">BOOK</a> : <code>Array.&lt;string&gt;</code></dt>
<dd><p>Names of the books of the Torah. BOOK[1] === &#39;Genesis&#39;</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#formatAliyahWithBook">formatAliyahWithBook(a)</a> ⇒ <code>string</code></dt>
<dd><p>Formats an aliyah object like &quot;Numbers 28:9-28:15&quot;</p>
</dd>
<dt><a href="#formatAliyahShort">formatAliyahShort(aliyah, showBook)</a> ⇒ <code>string</code></dt>
<dd><p>Formats an aliyah object like &quot;Numbers 28:9-15&quot;</p>
</dd>
<dt><a href="#hasFestival">hasFestival(holiday)</a> ⇒ <code>boolean</code></dt>
<dd><p>Is there a special festival Torah Reading for <code>holiday</code>?</p>
</dd>
<dt><a href="#lookupFestival">lookupFestival(holiday)</a> ⇒ <code>any</code></dt>
<dd><p>Returns the raw metadata for festival reading for <code>holiday</code></p>
</dd>
<dt><a href="#getLeyningKeyForEvent">getLeyningKeyForEvent(ev, [il])</a> ⇒ <code>string</code></dt>
<dd><p>Based on the event date, type and title, finds the relevant leyning key</p>
</dd>
<dt><a href="#getLeyningForHoliday">getLeyningForHoliday(ev, [il])</a> ⇒ <code><a href="#Leyning">Leyning</a></code></dt>
<dd><p>Looks up leyning for a given holiday. Returns some
of full kriyah aliyot, special Maftir, special Haftarah</p>
</dd>
<dt><a href="#makeLeyningSummary">makeLeyningSummary(aliyot)</a> ⇒ <code>string</code></dt>
<dd><p>Makes a summary of the leyning, like &quot;Genesis 6:9-11:32&quot;</p>
</dd>
<dt><a href="#getLeyningForHolidayKey">getLeyningForHolidayKey(key, [cholHaMoedDay])</a> ⇒ <code><a href="#Leyning">Leyning</a></code></dt>
<dd><p>Looks up leyning for a given holiday key. Key should be an
(untranslated) string used in holiday-readings.json. Returns some
of full kriyah aliyot, special Maftir, special Haftarah</p>
</dd>
<dt><a href="#getLeyningForParsha">getLeyningForParsha(parsha)</a> ⇒ <code><a href="#Leyning">Leyning</a></code></dt>
<dd><p>Looks up regular leyning for a weekly parsha with no special readings</p>
</dd>
<dt><a href="#getLeyningForParshaHaShavua">getLeyningForParshaHaShavua(ev, [il])</a> ⇒ <code><a href="#Leyning">Leyning</a></code></dt>
<dd><p>Looks up leyning for a regular Shabbat parsha, including any special
maftir or Haftara.</p>
</dd>
<dt><a href="#getLeyningOnDate">getLeyningOnDate(hdate, il)</a> ⇒ <code><a href="#Leyning">Leyning</a></code></dt>
<dd><p>Looks up leyning for a regular Shabbat, Monday/Thursday weekday or holiday.</p>
<p>If <code>hdate</code> coincides with a holiday that has Torah reading, returns the
reading for that day (see <a href="#getLeyningForHoliday">getLeyningForHoliday</a>)</p>
<p>Otherwise, if <code>hdate</code> is a Saturday, returns <a href="#getLeyningForParshaHaShavua">getLeyningForParshaHaShavua</a></p>
<p>Otherwise, if <code>hdate</code> is a Monday or Thursday, returns <a href="#Leyning">Leyning</a> for the
Parashat haShavua, containing only the <code>weekday</code> aliyot (no <code>fullkriyah</code>).</p>
<p>Otherwise, returns <code>undefined</code>.</p>
</dd>
<dt><a href="#lookupParsha">lookupParsha(parsha)</a> ⇒ <code><a href="#ParshaMeta">ParshaMeta</a></code></dt>
<dd><p>Returns the parsha metadata</p>
</dd>
<dt><a href="#getTriennial">getTriennial(year)</a> ⇒ <code><a href="#Triennial">Triennial</a></code></dt>
<dd><p>Calculates the 3-year readings for a given year</p>
</dd>
<dt><a href="#getTriennialForParshaHaShavua">getTriennialForParshaHaShavua(ev)</a> ⇒ <code><a href="#TriennialAliyot">TriennialAliyot</a></code></dt>
<dd><p>Looks up the triennial leyning for this Parashat HaShavua</p>
</dd>
<dt><a href="#getTriennialHaftaraForHoliday">getTriennialHaftaraForHoliday(key, yearNum)</a> ⇒ <code>Object</code></dt>
<dd><p>Looks up the alternative triennial Haftara for a holiday</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#Aliyah">Aliyah</a> : <code>Object</code></dt>
<dd><p>Represents an aliyah</p>
</dd>
<dt><a href="#LeyningNames">LeyningNames</a> : <code>Object</code></dt>
<dd><p>Name of the parsha hashavua or holiday</p>
</dd>
<dt><a href="#Leyning">Leyning</a> : <code>Object</code></dt>
<dd><p>Leyning for a parsha hashavua or holiday</p>
</dd>
<dt><a href="#ParshaMeta">ParshaMeta</a> : <code>Object</code></dt>
<dd><p>Parsha metadata</p>
</dd>
<dt><a href="#TriennialAliyot">TriennialAliyot</a> : <code>Object</code></dt>
<dd><p>Represents triennial aliyot for a given date</p>
</dd>
</dl>

<a name="Triennial"></a>

## Triennial
Triennial Torah readings

**Kind**: global class  

* [Triennial](#Triennial)
    * [new Triennial([hebrewYear])](#new_Triennial_new)
    * _instance_
        * [.getReading(parsha, yearNum)](#Triennial+getReading) ⇒ <code>Object.&lt;string, Aliyah&gt;</code>
        * [.getStartYear()](#Triennial+getStartYear) ⇒ <code>number</code>
        * [.debug()](#Triennial+debug) ⇒ <code>string</code>
    * _static_
        * [.getYearNumber(year)](#Triennial.getYearNumber) ⇒ <code>number</code>
        * [.getCycleStartYear(year)](#Triennial.getCycleStartYear) ⇒ <code>number</code>

<a name="new_Triennial_new"></a>

### new Triennial([hebrewYear])
Builds a Triennial object


| Param | Type | Description |
| --- | --- | --- |
| [hebrewYear] | <code>number</code> | Hebrew Year (default current year) |

<a name="Triennial+getReading"></a>

### triennial.getReading(parsha, yearNum) ⇒ <code>Object.&lt;string, Aliyah&gt;</code>
**Kind**: instance method of [<code>Triennial</code>](#Triennial)  
**Returns**: <code>Object.&lt;string, Aliyah&gt;</code> - a map of aliyot 1-7 plus "M"  

| Param | Type | Description |
| --- | --- | --- |
| parsha | <code>string</code> | parsha name ("Bereshit" or "Achrei Mot-Kedoshim") |
| yearNum | <code>number</code> | 0 through 2 for which year of Triennial cycle |

<a name="Triennial+getStartYear"></a>

### triennial.getStartYear() ⇒ <code>number</code>
**Kind**: instance method of [<code>Triennial</code>](#Triennial)  
<a name="Triennial+debug"></a>

### triennial.debug() ⇒ <code>string</code>
**Kind**: instance method of [<code>Triennial</code>](#Triennial)  
<a name="Triennial.getYearNumber"></a>

### Triennial.getYearNumber(year) ⇒ <code>number</code>
Returns triennial year 1, 2 or 3 based on this Hebrew year

**Kind**: static method of [<code>Triennial</code>](#Triennial)  

| Param | Type | Description |
| --- | --- | --- |
| year | <code>number</code> | Hebrew year |

<a name="Triennial.getCycleStartYear"></a>

### Triennial.getCycleStartYear(year) ⇒ <code>number</code>
Returns Hebrew year that this 3-year triennial cycle began

**Kind**: static method of [<code>Triennial</code>](#Triennial)  

| Param | Type | Description |
| --- | --- | --- |
| year | <code>number</code> | Hebrew year |

<a name="BOOK"></a>

## BOOK : <code>Array.&lt;string&gt;</code>
Names of the books of the Torah. BOOK[1] === 'Genesis'

**Kind**: global constant  
**Read only**: true  
<a name="formatAliyahWithBook"></a>

## formatAliyahWithBook(a) ⇒ <code>string</code>
Formats an aliyah object like "Numbers 28:9-28:15"

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| a | [<code>Aliyah</code>](#Aliyah) | aliyah |

<a name="formatAliyahShort"></a>

## formatAliyahShort(aliyah, showBook) ⇒ <code>string</code>
Formats an aliyah object like "Numbers 28:9-15"

**Kind**: global function  

| Param | Type |
| --- | --- |
| aliyah | [<code>Aliyah</code>](#Aliyah) | 
| showBook | <code>boolean</code> | 

<a name="hasFestival"></a>

## hasFestival(holiday) ⇒ <code>boolean</code>
Is there a special festival Torah Reading for `holiday`?

**Kind**: global function  

| Param | Type |
| --- | --- |
| holiday | <code>string</code> | 

<a name="lookupFestival"></a>

## lookupFestival(holiday) ⇒ <code>any</code>
Returns the raw metadata for festival reading for `holiday`

**Kind**: global function  

| Param | Type |
| --- | --- |
| holiday | <code>string</code> | 

<a name="getLeyningKeyForEvent"></a>

## getLeyningKeyForEvent(ev, [il]) ⇒ <code>string</code>
Based on the event date, type and title, finds the relevant leyning key

**Kind**: global function  
**Returns**: <code>string</code> - key to look up in holiday-reading.json  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| ev | <code>Event</code> |  | event |
| [il] | <code>boolean</code> | <code>false</code> | true if Israel holiday scheme |

<a name="getLeyningForHoliday"></a>

## getLeyningForHoliday(ev, [il]) ⇒ [<code>Leyning</code>](#Leyning)
Looks up leyning for a given holiday. Returns some
of full kriyah aliyot, special Maftir, special Haftarah

**Kind**: global function  
**Returns**: [<code>Leyning</code>](#Leyning) - map of aliyot  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| ev | <code>Event</code> |  | the Hebcal event associated with this leyning |
| [il] | <code>boolean</code> | <code>false</code> | true if Israel holiday scheme |

<a name="makeLeyningSummary"></a>

## makeLeyningSummary(aliyot) ⇒ <code>string</code>
Makes a summary of the leyning, like "Genesis 6:9-11:32"

**Kind**: global function  

| Param | Type |
| --- | --- |
| aliyot | <code>Object.&lt;string, Aliyah&gt;</code> | 

<a name="getLeyningForHolidayKey"></a>

## getLeyningForHolidayKey(key, [cholHaMoedDay]) ⇒ [<code>Leyning</code>](#Leyning)
Looks up leyning for a given holiday key. Key should be an
(untranslated) string used in holiday-readings.json. Returns some
of full kriyah aliyot, special Maftir, special Haftarah

**Kind**: global function  
**Returns**: [<code>Leyning</code>](#Leyning) - map of aliyot  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | name from `holiday-readings.json` to find |
| [cholHaMoedDay] | <code>number</code> |  |

<a name="getLeyningForParsha"></a>

## getLeyningForParsha(parsha) ⇒ [<code>Leyning</code>](#Leyning)
Looks up regular leyning for a weekly parsha with no special readings

**Kind**: global function  
**Returns**: [<code>Leyning</code>](#Leyning) - map of aliyot  

| Param | Type | Description |
| --- | --- | --- |
| parsha | <code>string</code> \| <code>Array.&lt;string&gt;</code> | untranslated name like 'Pinchas' or ['Pinchas'] or ['Matot','Masei'] |

<a name="getLeyningForParsha..result"></a>

### getLeyningForParsha~result : [<code>Leyning</code>](#Leyning)
**Kind**: inner constant of [<code>getLeyningForParsha</code>](#getLeyningForParsha)  
<a name="getLeyningForParshaHaShavua"></a>

## getLeyningForParshaHaShavua(ev, [il]) ⇒ [<code>Leyning</code>](#Leyning)
Looks up leyning for a regular Shabbat parsha, including any special
maftir or Haftara.

**Kind**: global function  
**Returns**: [<code>Leyning</code>](#Leyning) - map of aliyot  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| ev | <code>Event</code> |  | the Hebcal event associated with this leyning |
| [il] | <code>boolean</code> | <code>false</code> | in Israel |

<a name="getLeyningOnDate"></a>

## getLeyningOnDate(hdate, il) ⇒ [<code>Leyning</code>](#Leyning)
Looks up leyning for a regular Shabbat, Monday/Thursday weekday or holiday.

If `hdate` coincides with a holiday that has Torah reading, returns the
reading for that day (see [getLeyningForHoliday](#getLeyningForHoliday))

Otherwise, if `hdate` is a Saturday, returns [getLeyningForParshaHaShavua](#getLeyningForParshaHaShavua)

Otherwise, if `hdate` is a Monday or Thursday, returns [Leyning](#Leyning) for the
Parashat haShavua, containing only the `weekday` aliyot (no `fullkriyah`).

Otherwise, returns `undefined`.

**Kind**: global function  
**Returns**: [<code>Leyning</code>](#Leyning) - map of aliyot  

| Param | Type | Description |
| --- | --- | --- |
| hdate | <code>HDate</code> | Hebrew Date |
| il | <code>boolean</code> | in Israel |

<a name="lookupParsha"></a>

## lookupParsha(parsha) ⇒ [<code>ParshaMeta</code>](#ParshaMeta)
Returns the parsha metadata

**Kind**: global function  

| Param | Type |
| --- | --- |
| parsha | <code>string</code> \| <code>Array.&lt;string&gt;</code> | 

<a name="getTriennial"></a>

## getTriennial(year) ⇒ [<code>Triennial</code>](#Triennial)
Calculates the 3-year readings for a given year

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| year | <code>number</code> | Hebrew year |

<a name="getTriennialForParshaHaShavua"></a>

## getTriennialForParshaHaShavua(ev) ⇒ [<code>TriennialAliyot</code>](#TriennialAliyot)
Looks up the triennial leyning for this Parashat HaShavua

**Kind**: global function  
**Returns**: [<code>TriennialAliyot</code>](#TriennialAliyot) - a map of aliyot 1-7 plus "M"  

| Param | Type |
| --- | --- |
| ev | <code>Event</code> | 

<a name="getTriennialHaftaraForHoliday"></a>

## getTriennialHaftaraForHoliday(key, yearNum) ⇒ <code>Object</code>
Looks up the alternative triennial Haftara for a holiday

**Kind**: global function  

| Param | Type |
| --- | --- |
| key | <code>string</code> | 
| yearNum | <code>number</code> | 

<a name="Aliyah"></a>

## Aliyah : <code>Object</code>
Represents an aliyah

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| k | <code>string</code> | Book (e.g. "Numbers") |
| b | <code>string</code> | beginning verse (e.g. "28:9") |
| e | <code>string</code> | ending verse (e.g. "28:15") |
| [v] | <code>number</code> | number of verses |
| [p] | <code>number</code> | parsha number (1=Bereshit, 54=Vezot HaBracha) |

<a name="LeyningNames"></a>

## LeyningNames : <code>Object</code>
Name of the parsha hashavua or holiday

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| en | <code>string</code> | English |
| he | <code>string</code> | Hebrew (with nikud) |

<a name="Leyning"></a>

## Leyning : <code>Object</code>
Leyning for a parsha hashavua or holiday

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | [<code>LeyningNames</code>](#LeyningNames) |  |
| [parsha] | <code>Array.&lt;string&gt;</code> | An array of either 1 (regular) or 2 (doubled parsha).    `undefined` for holiday readings |
| [parshaNum] | <code>number</code> | 1 for Bereshit, 2 for Noach, etc. `undefined` for holiday readings |
| summary | <code>string</code> | Such as `Genesis 1:1 - 6:8` |
| haft | [<code>Aliyah</code>](#Aliyah) \| [<code>Array.&lt;Aliyah&gt;</code>](#Aliyah) | Haftarah object(s) |
| haftara | <code>string</code> | Haftarah, such as `Isaiah 42:5 – 43:11` |
| [haftaraNumV] | <code>number</code> | Number of verses in the Haftarah |
| [seph] | [<code>Aliyah</code>](#Aliyah) \| [<code>Array.&lt;Aliyah&gt;</code>](#Aliyah) | Haftarah object(s) for Sephardim |
| [sephardic] | <code>string</code> | Haftarah for Sephardim, such as `Isaiah 42:5 - 42:21` |
| [sephardicNumV] | <code>number</code> | Number of verses in the Haftarah for Sephardim |
| fullkriyah | <code>Object.&lt;string, Aliyah&gt;</code> | Map of aliyot `1` through `7` plus `M` for maftir |
| [weekday] | <code>Object.&lt;string, Aliyah&gt;</code> | Optional map of weekday Torah Readings    aliyot `1` through `3` for Monday and Thursday |
| [reason] | <code>Object.&lt;string, string&gt;</code> | Explanations for special readings,    keyed by aliyah number, `M` for maftir or `haftara` for Haftarah |

<a name="ParshaMeta"></a>

## ParshaMeta : <code>Object</code>
Parsha metadata

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| num | <code>number</code> | 1 for Bereshit, 2 for Noach, etc. `undefined` for holiday readings |
| hebrew | <code>string</code> | parsha name in Hebrew with niqud |
| book | <code>number</code> | 1 for Genesis, 2 for Exodus, 5 for Deuteronomy |
| haft | [<code>Aliyah</code>](#Aliyah) \| [<code>Array.&lt;Aliyah&gt;</code>](#Aliyah) | Haftarah object(s) |
| [seph] | [<code>Aliyah</code>](#Aliyah) \| [<code>Array.&lt;Aliyah&gt;</code>](#Aliyah) | Haftarah object(s) for Sephardim |
| fullkriyah | <code>Object.&lt;string, Array.&lt;string&gt;&gt;</code> | Map of aliyot `1` through `7` plus `M` for maftir |
| weekday | <code>Object.&lt;string, Array.&lt;string&gt;&gt;</code> | Map of weekday Torah Readings    aliyot `1` through `3` for Monday and Thursday |

<a name="TriennialAliyot"></a>

## TriennialAliyot : <code>Object</code>
Represents triennial aliyot for a given date

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| aliyot | <code>Object.&lt;string, Aliyah&gt;</code> | a map of aliyot 1-7 plus "M" |
| yearNum | <code>number</code> | year number, 0-2 |
| date | <code>Date</code> | Shabbat date for when this parsha is read in this 3-year cycle |
| [readSeparately] | <code>boolean</code> | true if a double parsha is read separately in year `yearNum` |
| [date1] | <code>Date</code> | Shabbat date of the first part of a read-separately aliyah pair |
| [date2] | <code>Date</code> | Shabbat date of the second part of a read-separately aliyah pair |
