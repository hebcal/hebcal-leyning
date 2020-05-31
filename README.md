# hebcal-leyning
Javascript Torah Reading API for Parashat HaShavua and holidays

## Installation
```bash
$ npm install @hebcal/leyning
```

## Synopsis
```javascript
import {hebcal, HDate, Event} from '@hebcal/core';
import leyning from '@hebcal/leyning';

const options = {sedrot: true, noHolidays: true};
const events = hebcal.hebrewCalendar(options);
const ev = events.find((e) => e.getDesc() == 'Parashat Pinchas');
const aliyot = leyning.getLeyningForParshaHaShavua(ev);
```

## Classes

<dl>
<dt><a href="#Triennial">Triennial</a></dt>
<dd><p>Triennial Torah readings</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#getLeyningKeyForEvent">getLeyningKeyForEvent(e, [il])</a> ⇒ <code>string</code></dt>
<dd><p>Based on the event date, type and title, finds the relevant leyning key</p>
</dd>
<dt><a href="#getLeyningForHoliday">getLeyningForHoliday(e, [il])</a> ⇒ <code><a href="#Leyning">Leyning</a></code></dt>
<dd><p>Looks up leyning for a given holiday name. Name should be an
(untranslated) string used in holiday-readons.json. Returns some
of full kriyah aliyot, special Maftir, special Haftarah</p>
</dd>
<dt><a href="#parshaToString">parshaToString(parsha)</a> ⇒ <code>string</code></dt>
<dd><p>Formats parsha as a string</p>
</dd>
<dt><a href="#getHaftaraKey">getHaftaraKey(parsha)</a> ⇒ <code>string</code></dt>
<dd><p>on doubled parshiot, read only the second Haftarah
except for Nitzavim-Vayelech</p>
</dd>
<dt><a href="#getChanukahShabbatKey">getChanukahShabbatKey(e, key)</a> ⇒ <code>string</code></dt>
<dd></dd>
<dt><a href="#getHolidayEvents">getHolidayEvents(hd, il)</a> ⇒ <code>Array.&lt;Event&gt;</code></dt>
<dd><p>Filters out Rosh Chodesh and events that don&#39;t occur in this location</p>
</dd>
<dt><a href="#getLeyningForParshaHaShavua">getLeyningForParshaHaShavua(e, [il])</a> ⇒ <code><a href="#Leyning">Leyning</a></code></dt>
<dd><p>Looks up leyning for a regular Shabbat parsha.</p>
</dd>
<dt><a href="#formatAliyahWithBook">formatAliyahWithBook(a)</a> ⇒ <code>string</code></dt>
<dd><p>Formats an aliyah object like &quot;Numbers 28:9 - 28:15&quot;</p>
</dd>
<dt><a href="#getDoubledName">getDoubledName(id)</a> ⇒ <code>string</code></dt>
<dd><p>takes a 0-based (Bereshit=0) parsha ID</p>
</dd>
<dt><a href="#getTriennial">getTriennial(year)</a> ⇒ <code><a href="#Triennial">Triennial</a></code></dt>
<dd><p>Calculates the 3-year readings for a given year</p>
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
</dl>

<a name="Triennial"></a>

## Triennial
Triennial Torah readings

**Kind**: global class  

* [Triennial](#Triennial)
    * [new Triennial([hebrewYear], [aliyot])](#new_Triennial_new)
    * _instance_
        * [.getReadings()](#Triennial+getReadings) ⇒ <code>Object</code>
        * [.getStartYear()](#Triennial+getStartYear) ⇒ <code>number</code>
        * [.getThreeYearPattern(id)](#Triennial+getThreeYearPattern) ⇒ <code>string</code>
        * [.cycleReadings(cycleOption)](#Triennial+cycleReadings) ⇒ <code>Map.&lt;string, Array.&lt;Object&gt;&gt;</code>
        * [.cycleReadingsForYear(option, readings, yr)](#Triennial+cycleReadingsForYear)
    * _static_
        * [.getYearNumber(year)](#Triennial.getYearNumber) ⇒ <code>number</code>
        * [.getCycleStartYear(year)](#Triennial.getCycleStartYear) ⇒ <code>number</code>
        * [.getTriennialAliyot()](#Triennial.getTriennialAliyot) ⇒ <code>Object</code>
        * [.resolveSameAs(parsha, book, triennial)](#Triennial.resolveSameAs) ⇒ <code>Object</code>

<a name="new_Triennial_new"></a>

### new Triennial([hebrewYear], [aliyot])
Builds a Triennial object


| Param | Type | Description |
| --- | --- | --- |
| [hebrewYear] | <code>number</code> | Hebrew Year (default current year) |
| [aliyot] | <code>Object</code> | aliyot.json object |

<a name="Triennial+getReadings"></a>

### triennial.getReadings() ⇒ <code>Object</code>
**Kind**: instance method of [<code>Triennial</code>](#Triennial)  
<a name="Triennial+getStartYear"></a>

### triennial.getStartYear() ⇒ <code>number</code>
**Kind**: instance method of [<code>Triennial</code>](#Triennial)  
<a name="Triennial+getThreeYearPattern"></a>

### triennial.getThreeYearPattern(id) ⇒ <code>string</code>
First, determine if a doubled parsha is read [T]ogether or [S]eparately
in each of the 3 years. Yields a pattern like 'SSS', 'STS', 'TTT', 'TTS'.

**Kind**: instance method of [<code>Triennial</code>](#Triennial)  

| Param | Type |
| --- | --- |
| id | <code>number</code> | 

<a name="Triennial+cycleReadings"></a>

### triennial.cycleReadings(cycleOption) ⇒ <code>Map.&lt;string, Array.&lt;Object&gt;&gt;</code>
Builds a lookup table readings["Bereshit"][1], readings["Matot-Masei"][3]

**Kind**: instance method of [<code>Triennial</code>](#Triennial)  

| Param | Type |
| --- | --- |
| cycleOption | <code>Object</code> | 

<a name="Triennial+cycleReadingsForYear"></a>

### triennial.cycleReadingsForYear(option, readings, yr)
**Kind**: instance method of [<code>Triennial</code>](#Triennial)  

| Param | Type |
| --- | --- |
| option | <code>string</code> | 
| readings | <code>Map.&lt;string, Array.&lt;Object&gt;&gt;</code> | 
| yr | <code>number</code> | 

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

<a name="Triennial.getTriennialAliyot"></a>

### Triennial.getTriennialAliyot() ⇒ <code>Object</code>
Walks parshiyotObj and builds lookup table for triennial aliyot

**Kind**: static method of [<code>Triennial</code>](#Triennial)  
<a name="Triennial.resolveSameAs"></a>

### Triennial.resolveSameAs(parsha, book, triennial) ⇒ <code>Object</code>
Transforms input JSON with sameAs shortcuts like "D.2":"A.3" to
actual aliyot objects for a given variation/year

**Kind**: static method of [<code>Triennial</code>](#Triennial)  

| Param | Type |
| --- | --- |
| parsha | <code>string</code> | 
| book | <code>string</code> | 
| triennial | <code>Object</code> | 

<a name="getLeyningKeyForEvent"></a>

## getLeyningKeyForEvent(e, [il]) ⇒ <code>string</code>
Based on the event date, type and title, finds the relevant leyning key

**Kind**: global function  
**Returns**: <code>string</code> - key to look up in holiday-reading.json  

| Param | Type | Description |
| --- | --- | --- |
| e | <code>Event</code> | event |
| [il] | <code>boolean</code> | true if Israel holiday scheme |

<a name="getLeyningForHoliday"></a>

## getLeyningForHoliday(e, [il]) ⇒ [<code>Leyning</code>](#Leyning)
Looks up leyning for a given holiday name. Name should be an
(untranslated) string used in holiday-readons.json. Returns some
of full kriyah aliyot, special Maftir, special Haftarah

**Kind**: global function  
**Returns**: [<code>Leyning</code>](#Leyning) - map of aliyot  

| Param | Type | Description |
| --- | --- | --- |
| e | <code>Event</code> | the Hebcal event associated with this leyning |
| [il] | <code>boolean</code> | true if Israel holiday scheme |

<a name="parshaToString"></a>

## parshaToString(parsha) ⇒ <code>string</code>
Formats parsha as a string

**Kind**: global function  

| Param | Type |
| --- | --- |
| parsha | <code>Array.&lt;string&gt;</code> | 

<a name="getHaftaraKey"></a>

## getHaftaraKey(parsha) ⇒ <code>string</code>
on doubled parshiot, read only the second Haftarah
except for Nitzavim-Vayelech

**Kind**: global function  

| Param | Type |
| --- | --- |
| parsha | <code>Array.&lt;string&gt;</code> | 

<a name="getChanukahShabbatKey"></a>

## getChanukahShabbatKey(e, key) ⇒ <code>string</code>
**Kind**: global function  

| Param | Type |
| --- | --- |
| e | <code>Event</code> | 
| key | <code>string</code> | 

<a name="getHolidayEvents"></a>

## getHolidayEvents(hd, il) ⇒ <code>Array.&lt;Event&gt;</code>
Filters out Rosh Chodesh and events that don't occur in this location

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| hd | <code>HDate</code> | Hebrew date |
| il | <code>boolean</code> | in Israel |

<a name="getLeyningForParshaHaShavua"></a>

## getLeyningForParshaHaShavua(e, [il]) ⇒ [<code>Leyning</code>](#Leyning)
Looks up leyning for a regular Shabbat parsha.

**Kind**: global function  
**Returns**: [<code>Leyning</code>](#Leyning) - map of aliyot  

| Param | Type | Description |
| --- | --- | --- |
| e | <code>Event</code> | the Hebcal event associated with this leyning |
| [il] | <code>booleam</code> | in Israel |

<a name="formatAliyahWithBook"></a>

## formatAliyahWithBook(a) ⇒ <code>string</code>
Formats an aliyah object like "Numbers 28:9 - 28:15"

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| a | [<code>Aliyah</code>](#Aliyah) | aliyah |

<a name="getDoubledName"></a>

## getDoubledName(id) ⇒ <code>string</code>
takes a 0-based (Bereshit=0) parsha ID

**Kind**: global function  

| Param | Type |
| --- | --- |
| id | <code>number</code> | 

<a name="getTriennial"></a>

## getTriennial(year) ⇒ [<code>Triennial</code>](#Triennial)
Calculates the 3-year readings for a given year

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| year | <code>number</code> | Hebrew year |

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
| haftara | <code>string</code> | Haftarah |
| fullkriyah | <code>Map.&lt;string, Aliyah&gt;</code> |  |
| [reason] | <code>Object</code> |  |

