**@hebcal/leyning** • [**Docs**](globals.md)

***

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

## Interfaces

- [StringToBoolMap](_media/StringToBoolMap.md)

## Type Aliases

- [Aliyah](_media/Aliyah.md)
- [AliyotMap](_media/AliyotMap.md)
- [Haftarah](_media/Haftarah.md)
- [Leyning](_media/Leyning.md)
- [LeyningBase](_media/LeyningBase.md)
- [LeyningNames](_media/LeyningNames.md)
- [LeyningParshaHaShavua](_media/LeyningParshaHaShavua.md)
- [LeyningShabbatHoliday](_media/LeyningShabbatHoliday.md)
- [LeyningWeekday](_media/LeyningWeekday.md)
- [ParshaMeta](_media/ParshaMeta.md)
- [SpecialReading](_media/SpecialReading.md)
- [StringMap](_media/StringMap.md)

## Variables

- [BOOK](_media/BOOK.md)

## Functions

- [calculateNumVerses](_media/calculateNumVerses.md)
- [clone](_media/clone.md)
- [cloneHaftara](_media/cloneHaftara.md)
- [formatAliyahShort](_media/formatAliyahShort.md)
- [formatAliyahWithBook](_media/formatAliyahWithBook.md)
- [getLeyningForHoliday](_media/getLeyningForHoliday.md)
- [getLeyningForHolidayKey](_media/getLeyningForHolidayKey.md)
- [getLeyningForParsha](_media/getLeyningForParsha.md)
- [getLeyningForParshaHaShavua](_media/getLeyningForParshaHaShavua.md)
- [getLeyningKeyForEvent](_media/getLeyningKeyForEvent.md)
- [getLeyningOnDate](_media/getLeyningOnDate.md)
- [getParshaDates](_media/getParshaDates.md)
- [getWeekdayReading](_media/getWeekdayReading.md)
- [hasFestival](_media/hasFestival.md)
- [lookupFestival](_media/lookupFestival.md)
- [lookupParsha](_media/lookupParsha.md)
- [makeLeyningNames](_media/makeLeyningNames.md)
- [makeLeyningParts](_media/makeLeyningParts.md)
- [makeLeyningSummary](_media/makeLeyningSummary.md)
- [makeSummaryFromParts](_media/makeSummaryFromParts.md)
- [parshaToString](_media/parshaToString.md)
- [specialReadings2](_media/specialReadings2.md)
- [sumVerses](_media/sumVerses.md)
- [writeCsvLines](_media/writeCsvLines.md)
- [writeFullKriyahCsv](_media/writeFullKriyahCsv.md)
- [writeHolidayMincha](_media/writeHolidayMincha.md)
