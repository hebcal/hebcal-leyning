# @hebcal/leyning
Javascript Torah Reading API for Parashat HaShavua and holidays

[![Build Status](https://circleci.com/gh/hebcal/hebcal-leyning.svg?style=svg)](https://circleci.com/gh/hebcal/hebcal-leyning)

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
<dt><a href="#BOOK">BOOK</a></dt>
<dd><p>Names of the books of the Torah. BOOK[1] === &#39;Genesis&#39;</p>
</dd>
</dl>

## Functions

<dl>
<dt><del><a href="#addSefariaLinksToLeyning">addSefariaLinksToLeyning(aliyot, showBook)</a></del></dt>
<dd><p>Makes Sefaria links by adding <code>href</code>, <code>verses</code> and <code>num</code> attributes to each aliyah.
CAUTION: Modifies the <code>aliyot</code> parameter instead of making a copy.</p>
</dd>
<dt><a href="#getLeyningKeyForEvent">getLeyningKeyForEvent(e, [il])</a> ⇒ <code>string</code></dt>
<dd><p>Based on the event date, type and title, finds the relevant leyning key</p>
</dd>
<dt><a href="#getLeyningForHoliday">getLeyningForHoliday(e, [il])</a> ⇒ <code><a href="#Leyning">Leyning</a></code></dt>
<dd><p>Looks up leyning for a given holiday. Returns some
of full kriyah aliyot, special Maftir, special Haftarah</p>
</dd>
<dt><a href="#makeLeyningSummary">makeLeyningSummary(aliyot)</a> ⇒ <code>string</code></dt>
<dd><p>Makes a summary of the leyning, like &quot;Genesis 6:9-11:32&quot;</p>
</dd>
<dt><a href="#getLeyningForHolidayKey">getLeyningForHolidayKey(key)</a> ⇒ <code><a href="#Leyning">Leyning</a></code></dt>
<dd><p>Looks up leyning for a given holiday key. Key should be an
(untranslated) string used in holiday-readings.json. Returns some
of full kriyah aliyot, special Maftir, special Haftarah</p>
</dd>
<dt><a href="#getLeyningForParsha">getLeyningForParsha(parsha)</a> ⇒ <code><a href="#Leyning">Leyning</a></code></dt>
<dd><p>Looks up regular leyning for a weekly parsha with no special readings</p>
</dd>
<dt><a href="#getLeyningForParshaHaShavua">getLeyningForParshaHaShavua(ev, [il])</a> ⇒ <code><a href="#Leyning">Leyning</a></code></dt>
<dd><p>Looks up leyning for a regular Shabbat parsha.</p>
</dd>
<dt><a href="#formatAliyahWithBook">formatAliyahWithBook(a)</a> ⇒ <code>string</code></dt>
<dd><p>Formats an aliyah object like &quot;Numbers 28:9-28:15&quot;</p>
</dd>
<dt><a href="#formatAliyahShort">formatAliyahShort(aliyah, showBook)</a> ⇒ <code>string</code></dt>
<dd><p>Formats an aliyah object like &quot;Numbers 28:9-15&quot;</p>
</dd>
<dt><a href="#getTriennial">getTriennial(year)</a> ⇒ <code><a href="#Triennial">Triennial</a></code></dt>
<dd><p>Calculates the 3-year readings for a given year</p>
</dd>
<dt><a href="#getTriennialForParshaHaShavua">getTriennialForParshaHaShavua(ev, [context])</a> ⇒ <code><a href="#TriennialAliyot">TriennialAliyot</a></code> | <code>Object.&lt;string, Aliyah&gt;</code></dt>
<dd><p>Looks up the triennial leyning for this Parashat HaShavua</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#Aliyah">Aliyah</a> : <code>Object</code></dt>
<dd><p>Represents an aliyah</p>
</dd>
<dt><a href="#Leyning">Leyning</a> : <code>Object</code></dt>
<dd><p>Leyning for a parsha hashavua or holiday</p>
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

## BOOK
Names of the books of the Torah. BOOK[1] === 'Genesis'

**Kind**: global constant  
<a name="addSefariaLinksToLeyning"></a>

## ~~addSefariaLinksToLeyning(aliyot, showBook)~~
***Deprecated***

Makes Sefaria links by adding `href`, `verses` and `num` attributes to each aliyah.
CAUTION: Modifies the `aliyot` parameter instead of making a copy.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| aliyot | <code>Object.&lt;string, Aliyah&gt;</code> | aliyah map to decorate |
| showBook | <code>boolean</code> | display the book name in the `verses` field (e.g. for special Maftir) |

<a name="getLeyningKeyForEvent"></a>

## getLeyningKeyForEvent(e, [il]) ⇒ <code>string</code>
Based on the event date, type and title, finds the relevant leyning key

**Kind**: global function  
**Returns**: <code>string</code> - key to look up in holiday-reading.json  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| e | <code>Event</code> |  | event |
| [il] | <code>boolean</code> | <code>false</code> | true if Israel holiday scheme |

<a name="getLeyningForHoliday"></a>

## getLeyningForHoliday(e, [il]) ⇒ [<code>Leyning</code>](#Leyning)
Looks up leyning for a given holiday. Returns some
of full kriyah aliyot, special Maftir, special Haftarah

**Kind**: global function  
**Returns**: [<code>Leyning</code>](#Leyning) - map of aliyot  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| e | <code>Event</code> |  | the Hebcal event associated with this leyning |
| [il] | <code>boolean</code> | <code>false</code> | true if Israel holiday scheme |

<a name="makeLeyningSummary"></a>

## makeLeyningSummary(aliyot) ⇒ <code>string</code>
Makes a summary of the leyning, like "Genesis 6:9-11:32"

**Kind**: global function  

| Param | Type |
| --- | --- |
| aliyot | <code>Object.&lt;string, Aliyah&gt;</code> | 

<a name="getLeyningForHolidayKey"></a>

## getLeyningForHolidayKey(key) ⇒ [<code>Leyning</code>](#Leyning)
Looks up leyning for a given holiday key. Key should be an
(untranslated) string used in holiday-readings.json. Returns some
of full kriyah aliyot, special Maftir, special Haftarah

**Kind**: global function  
**Returns**: [<code>Leyning</code>](#Leyning) - map of aliyot  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | name from `holiday-readings.json` to find |

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
Looks up leyning for a regular Shabbat parsha.

**Kind**: global function  
**Returns**: [<code>Leyning</code>](#Leyning) - map of aliyot  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| ev | <code>Event</code> |  | the Hebcal event associated with this leyning |
| [il] | <code>boolean</code> | <code>false</code> | in Israel |

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

<a name="getTriennial"></a>

## getTriennial(year) ⇒ [<code>Triennial</code>](#Triennial)
Calculates the 3-year readings for a given year

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| year | <code>number</code> | Hebrew year |

<a name="getTriennialForParshaHaShavua"></a>

## getTriennialForParshaHaShavua(ev, [context]) ⇒ [<code>TriennialAliyot</code>](#TriennialAliyot) \| <code>Object.&lt;string, Aliyah&gt;</code>
Looks up the triennial leyning for this Parashat HaShavua

**Kind**: global function  
**Returns**: [<code>TriennialAliyot</code>](#TriennialAliyot) \| <code>Object.&lt;string, Aliyah&gt;</code> - a map of aliyot 1-7 plus "M"  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| ev | <code>Event</code> |  |  |
| [context] | <code>boolean</code> | <code>false</code> | returns a reading wrapper object which includes `date`, `yearNum` and `aliyot` |

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

<a name="Leyning"></a>

## Leyning : <code>Object</code>
Leyning for a parsha hashavua or holiday

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| summary | <code>string</code> |  |
| haft | [<code>Aliyah</code>](#Aliyah) | Haftarah |
| haftara | <code>string</code> | Haftarah |
| [haftaraNumV] | <code>number</code> |  |
| [seph] | [<code>Aliyah</code>](#Aliyah) | Haftarah for Sephardic |
| [sephardic] | <code>string</code> | Haftarah for Sephardic |
| [sephardicNumV] | <code>number</code> |  |
| fullkriyah | <code>Object.&lt;string, Aliyah&gt;</code> |  |
| [weekday] | <code>Object.&lt;string, Aliyah&gt;</code> |  |
| [reason] | <code>Object</code> |  |

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
