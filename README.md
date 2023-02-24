# @hebcal/leyning
Javascript Torah Reading API for Parashat HaShavua and holidays

[![Build Status](https://github.com/hebcal/hebcal-leyning/actions/workflows/node.js.yml/badge.svg)](https://github.com/hebcal/hebcal-leyning/actions/workflows/node.js.yml)


This package includes both traditional (full kriyah) and weekday
Torah readings.

Triennial Torah Readings have moved to [@hebcal/triennial](https://github.com/hebcal/hebcal-triennial)

## Installation
```bash
$ npm install @hebcal/leyning
```

## Synopsis
```javascript
import {HebrewCalendar, HDate, Event} from '@hebcal/core';
import {getLeyningForParshaHaShavua, formatAliyahWithBook} from '@hebcal/leyning';

const events = HebrewCalendar.calendar({sedrot: true, noHolidays: true});
const ev = events.find((ev) => ev.getDesc() == 'Parashat Pinchas');
const reading = getLeyningForParshaHaShavua(ev, false);
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
```

## Constants

<dl>
<dt><a href="#BOOK">BOOK</a> : <code>Array.&lt;string&gt;</code></dt>
<dd><p>Names of the books of the Torah. BOOK[1] === &#39;Genesis&#39;</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#parshaToString">parshaToString(parsha)</a> ⇒ <code>string</code></dt>
<dd><p>Formats parsha as a string</p>
</dd>
<dt><a href="#clone">clone(src)</a> ⇒ <code>any</code></dt>
<dd><p>Makes a deep copy of the src object using JSON stringify and parse</p>
</dd>
<dt><a href="#calculateNumVerses">calculateNumVerses(aliyah)</a> ⇒ <code>number</code></dt>
<dd><p>Calculates the number of verses in an aliyah or haftara based on
the <code>b</code> (begin verse), <code>e</code> (end verse) and <code>k</code> (book).
Modifies <code>aliyah</code> by setting the <code>v</code> field.</p>
</dd>
<dt><a href="#formatAliyahWithBook">formatAliyahWithBook(a)</a> ⇒ <code>string</code></dt>
<dd><p>Formats an aliyah object like &quot;Numbers 28:9-28:15&quot;</p>
</dd>
<dt><a href="#formatAliyahShort">formatAliyahShort(aliyah, showBook)</a> ⇒ <code>string</code></dt>
<dd><p>Formats an aliyah object like &quot;Numbers 28:9-15&quot;</p>
</dd>
<dt><a href="#sumVerses">sumVerses(aliyot)</a> ⇒ <code>number</code></dt>
<dd><p>Returns the total number of verses in an array of Aliyah (or haftarah) objects</p>
</dd>
<dt><a href="#makeLeyningParts">makeLeyningParts(aliyot)</a> ⇒ <code><a href="#Aliyah">Array.&lt;Aliyah&gt;</a></code></dt>
<dd><p>Summarizes an <code>AliyotMap</code> by collapsing all adjacent aliyot.
Finds any non-overlapping parts (e.g. special 7th aliyah or maftir)</p>
</dd>
<dt><a href="#makeSummaryFromParts">makeSummaryFromParts(parts)</a> ⇒ <code>string</code></dt>
<dd><p>Returns a string representation of the leyning parts.
Separate verse ranges read from the same book are separated
by commas, e.g. <code>Isaiah 6:1-7:6, 9:5-6</code>.
Verse ranges from different books are separated by semicolons,
e.g. <code>Genesis 21:1-34; Numbers 29:1-6</code>.</p>
</dd>
<dt><a href="#makeLeyningSummary">makeLeyningSummary(aliyot)</a> ⇒ <code>string</code></dt>
<dd><p>Makes a summary of the leyning, like &quot;Genesis 6:9-11:32&quot;</p>
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
<dt><a href="#specialReadings2">specialReadings2(parsha, hd, il, aliyot)</a> ⇒ <code><a href="#SpecialReading">SpecialReading</a></code></dt>
<dd><p>Determines if the regular parashat haShavua coincides with an event that requires
a special maftir or Haftara (for example Shabbat HaGadol, Shabbat Chanukah, Rosh
Chodesh or Machar Chodesh, etc.).</p>
<p>This function does not modify <code>aliyot</code>. Instead, it returns a deep copy
with <code>aliyot[&#39;M&#39;]</code> replaced and sets <code>reason.M</code>
(and in some cases the 6th and 7th aliyah, setting <code>reason[&#39;7&#39;]</code>).</p>
<p>If a special Haftarah applies, the result will have a <code>haft</code> property
pointing to Haftarah object and sets <code>reason.haftara</code>.</p>
</dd>
<dt><a href="#getLeyningForHolidayKey">getLeyningForHolidayKey(key, [cholHaMoedDay])</a> ⇒ <code><a href="#Leyning">Leyning</a></code></dt>
<dd><p>Looks up leyning for a given holiday key. Key should be an
(untranslated) string used in holiday-readings.json. Returns some
of full kriyah aliyot, special Maftir, special Haftarah</p>
</dd>
<dt><a href="#getLeyningForHoliday">getLeyningForHoliday(ev, [il])</a> ⇒ <code><a href="#Leyning">Leyning</a></code></dt>
<dd><p>Looks up leyning for a given holiday. Returns some
of full kriyah aliyot, special Maftir, special Haftarah</p>
</dd>
<dt><a href="#getWeekdayReading">getWeekdayReading(parsha)</a> ⇒ <code>Object.&lt;string, Aliyah&gt;</code></dt>
<dd><p>Looks up Monday/Thursday aliyot for a regular parsha</p>
</dd>
<dt><a href="#getLeyningForParsha">getLeyningForParsha(parsha)</a> ⇒ <code><a href="#Leyning">Leyning</a></code></dt>
<dd><p>Looks up regular leyning for a weekly parsha with no special readings</p>
</dd>
<dt><a href="#getLeyningForParshaHaShavua">getLeyningForParshaHaShavua(ev, [il])</a> ⇒ <code><a href="#Leyning">Leyning</a></code></dt>
<dd><p>Looks up leyning for a regular Shabbat parsha, including any special
maftir or Haftara.</p>
</dd>
<dt><a href="#getLeyningOnDate">getLeyningOnDate(hdate, il, [wantarray])</a> ⇒ <code><a href="#Leyning">Leyning</a></code> | <code><a href="#Leyning">Array.&lt;Leyning&gt;</a></code></dt>
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
<dt><a href="#writeCsvLines">writeCsvLines(stream, ev, reading, il, isParsha)</a></dt>
<dd><p>Formats reading for CSV</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#Aliyah">Aliyah</a> : <code>Object</code></dt>
<dd><p>Represents an aliyah</p>
</dd>
<dt><a href="#SpecialReading">SpecialReading</a> : <code>Object</code></dt>
<dd><p>Leyning for a parsha hashavua or holiday</p>
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
</dl>

<a name="BOOK"></a>

## BOOK : <code>Array.&lt;string&gt;</code>
Names of the books of the Torah. BOOK[1] === 'Genesis'

**Kind**: global constant  
**Read only**: true  
<a name="parshaToString"></a>

## parshaToString(parsha) ⇒ <code>string</code>
Formats parsha as a string

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| parsha | <code>string</code> \| <code>Array.&lt;string&gt;</code> | untranslated name like 'Pinchas' or ['Pinchas'] or ['Matot','Masei'] |

<a name="clone"></a>

## clone(src) ⇒ <code>any</code>
Makes a deep copy of the src object using JSON stringify and parse

**Kind**: global function  

| Param | Type |
| --- | --- |
| src | <code>any</code> | 

<a name="calculateNumVerses"></a>

## calculateNumVerses(aliyah) ⇒ <code>number</code>
Calculates the number of verses in an aliyah or haftara based on
the `b` (begin verse), `e` (end verse) and `k` (book).
Modifies `aliyah` by setting the `v` field.

**Kind**: global function  

| Param | Type |
| --- | --- |
| aliyah | [<code>Aliyah</code>](#Aliyah) | 

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

<a name="sumVerses"></a>

## sumVerses(aliyot) ⇒ <code>number</code>
Returns the total number of verses in an array of Aliyah (or haftarah) objects

**Kind**: global function  

| Param | Type |
| --- | --- |
| aliyot | [<code>Aliyah</code>](#Aliyah) \| [<code>Array.&lt;Aliyah&gt;</code>](#Aliyah) | 

<a name="makeLeyningParts"></a>

## makeLeyningParts(aliyot) ⇒ [<code>Array.&lt;Aliyah&gt;</code>](#Aliyah)
Summarizes an `AliyotMap` by collapsing all adjacent aliyot.
Finds any non-overlapping parts (e.g. special 7th aliyah or maftir)

**Kind**: global function  

| Param | Type |
| --- | --- |
| aliyot | <code>Object.&lt;string, Aliyah&gt;</code> | 

<a name="makeSummaryFromParts"></a>

## makeSummaryFromParts(parts) ⇒ <code>string</code>
Returns a string representation of the leyning parts.
Separate verse ranges read from the same book are separated
by commas, e.g. `Isaiah 6:1-7:6, 9:5-6`.
Verse ranges from different books are separated by semicolons,
e.g. `Genesis 21:1-34; Numbers 29:1-6`.

**Kind**: global function  

| Param | Type |
| --- | --- |
| parts | [<code>Aliyah</code>](#Aliyah) \| [<code>Array.&lt;Aliyah&gt;</code>](#Aliyah) | 

<a name="makeLeyningSummary"></a>

## makeLeyningSummary(aliyot) ⇒ <code>string</code>
Makes a summary of the leyning, like "Genesis 6:9-11:32"

**Kind**: global function  

| Param | Type |
| --- | --- |
| aliyot | <code>Object.&lt;string, Aliyah&gt;</code> | 

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

<a name="specialReadings2"></a>

## specialReadings2(parsha, hd, il, aliyot) ⇒ [<code>SpecialReading</code>](#SpecialReading)
Determines if the regular parashat haShavua coincides with an event that requires
a special maftir or Haftara (for example Shabbat HaGadol, Shabbat Chanukah, Rosh
Chodesh or Machar Chodesh, etc.).

This function does not modify `aliyot`. Instead, it returns a deep copy
with `aliyot['M']` replaced and sets `reason.M`
(and in some cases the 6th and 7th aliyah, setting `reason['7']`).

If a special Haftarah applies, the result will have a `haft` property
pointing to Haftarah object and sets `reason.haftara`.

**Kind**: global function  

| Param | Type |
| --- | --- |
| parsha | <code>Array.&lt;string&gt;</code> | 
| hd | <code>HDate</code> | 
| il | <code>boolean</code> | 
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

<a name="getWeekdayReading"></a>

## getWeekdayReading(parsha) ⇒ <code>Object.&lt;string, Aliyah&gt;</code>
Looks up Monday/Thursday aliyot for a regular parsha

**Kind**: global function  
**Returns**: <code>Object.&lt;string, Aliyah&gt;</code> - map of aliyot  

| Param | Type | Description |
| --- | --- | --- |
| parsha | <code>string</code> \| <code>Array.&lt;string&gt;</code> | untranslated name like 'Pinchas' or ['Pinchas'] or ['Matot','Masei'] |

<a name="getLeyningForParsha"></a>

## getLeyningForParsha(parsha) ⇒ [<code>Leyning</code>](#Leyning)
Looks up regular leyning for a weekly parsha with no special readings

**Kind**: global function  
**Returns**: [<code>Leyning</code>](#Leyning) - map of aliyot  

| Param | Type | Description |
| --- | --- | --- |
| parsha | <code>string</code> \| <code>Array.&lt;string&gt;</code> | untranslated name like 'Pinchas' or ['Pinchas'] or ['Matot','Masei'] |

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

## getLeyningOnDate(hdate, il, [wantarray]) ⇒ [<code>Leyning</code>](#Leyning) \| [<code>Array.&lt;Leyning&gt;</code>](#Leyning)
Looks up leyning for a regular Shabbat, Monday/Thursday weekday or holiday.

If `hdate` coincides with a holiday that has Torah reading, returns the
reading for that day (see [getLeyningForHoliday](#getLeyningForHoliday))

Otherwise, if `hdate` is a Saturday, returns [getLeyningForParshaHaShavua](#getLeyningForParshaHaShavua)

Otherwise, if `hdate` is a Monday or Thursday, returns [Leyning](#Leyning) for the
Parashat haShavua, containing only the `weekday` aliyot (no `fullkriyah`).

Otherwise, returns `undefined`.

**Kind**: global function  
**Returns**: [<code>Leyning</code>](#Leyning) \| [<code>Array.&lt;Leyning&gt;</code>](#Leyning) - map of aliyot  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| hdate | <code>HDate</code> |  | Hebrew Date |
| il | <code>boolean</code> |  | in Israel |
| [wantarray] | <code>boolean</code> | <code>false</code> | to return an array of 0 or more readings |

<a name="lookupParsha"></a>

## lookupParsha(parsha) ⇒ [<code>ParshaMeta</code>](#ParshaMeta)
Returns the parsha metadata

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| parsha | <code>string</code> \| <code>Array.&lt;string&gt;</code> | untranslated name like 'Pinchas' or ['Pinchas'] or ['Matot','Masei'] |

<a name="writeCsvLines"></a>

## writeCsvLines(stream, ev, reading, il, isParsha)
Formats reading for CSV

**Kind**: global function  

| Param | Type |
| --- | --- |
| stream | <code>fs.WriteStream</code> | 
| ev | <code>Event</code> | 
| reading | [<code>Leyning</code>](#Leyning) | 
| il | <code>boolean</code> | 
| isParsha | <code>boolean</code> | 

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

<a name="SpecialReading"></a>

## SpecialReading : <code>Object</code>
Leyning for a parsha hashavua or holiday

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| aliyot | <code>Object.&lt;string, Aliyah&gt;</code> | Map of aliyot `1` through `7` plus `M` for maftir |
| [reason] | <code>Object.&lt;string, string&gt;</code> | Explanations for special readings,    keyed by aliyah number, `M` for maftir or `haftara` for Haftarah |
| haft | [<code>Aliyah</code>](#Aliyah) \| [<code>Array.&lt;Aliyah&gt;</code>](#Aliyah) | Haftarah object(s) |
| seph | [<code>Aliyah</code>](#Aliyah) \| [<code>Array.&lt;Aliyah&gt;</code>](#Aliyah) | Haftarah object(s) |

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
| [megillah] | <code>Object.&lt;string, Aliyah&gt;</code> | Optional map of megillah reading.    Song of Songs is read on the sabbath of Passover week, the Book of Ruth on Shavuot,    Lamentations on Tisha be-Av, Ecclesiastes on the sabbath of the week of Sukkoth,    and the Book of Esther on Purim. |

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
