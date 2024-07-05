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

- [StringToBoolMap](docs/interfaces/StringToBoolMap.md)

## Type Aliases

- [Aliyah](docs/type-aliases/Aliyah.md)
- [AliyotMap](docs/type-aliases/AliyotMap.md)
- [Haftarah](docs/type-aliases/Haftarah.md)
- [Leyning](docs/type-aliases/Leyning.md)
- [LeyningBase](docs/type-aliases/LeyningBase.md)
- [LeyningNames](docs/type-aliases/LeyningNames.md)
- [LeyningParshaHaShavua](docs/type-aliases/LeyningParshaHaShavua.md)
- [LeyningShabbatHoliday](docs/type-aliases/LeyningShabbatHoliday.md)
- [LeyningWeekday](docs/type-aliases/LeyningWeekday.md)
- [ParshaMeta](docs/type-aliases/ParshaMeta.md)
- [SpecialReading](docs/type-aliases/SpecialReading.md)
- [StringMap](docs/type-aliases/StringMap.md)

## Variables

- [BOOK](docs/variables/BOOK.md)

## Functions

- [calculateNumVerses](docs/functions/calculateNumVerses.md)
- [clone](docs/functions/clone.md)
- [cloneHaftara](docs/functions/cloneHaftara.md)
- [formatAliyahShort](docs/functions/formatAliyahShort.md)
- [formatAliyahWithBook](docs/functions/formatAliyahWithBook.md)
- [getLeyningForHoliday](docs/functions/getLeyningForHoliday.md)
- [getLeyningForHolidayKey](docs/functions/getLeyningForHolidayKey.md)
- [getLeyningForParsha](docs/functions/getLeyningForParsha.md)
- [getLeyningForParshaHaShavua](docs/functions/getLeyningForParshaHaShavua.md)
- [getLeyningKeyForEvent](docs/functions/getLeyningKeyForEvent.md)
- [getLeyningOnDate](docs/functions/getLeyningOnDate.md)
- [getParshaDates](docs/functions/getParshaDates.md)
- [getWeekdayReading](docs/functions/getWeekdayReading.md)
- [hasFestival](docs/functions/hasFestival.md)
- [lookupFestival](docs/functions/lookupFestival.md)
- [lookupParsha](docs/functions/lookupParsha.md)
- [makeLeyningNames](docs/functions/makeLeyningNames.md)
- [makeLeyningParts](docs/functions/makeLeyningParts.md)
- [makeLeyningSummary](docs/functions/makeLeyningSummary.md)
- [makeSummaryFromParts](docs/functions/makeSummaryFromParts.md)
- [parshaToString](docs/functions/parshaToString.md)
- [specialReadings2](docs/functions/specialReadings2.md)
- [sumVerses](docs/functions/sumVerses.md)
- [writeCsvLines](docs/functions/writeCsvLines.md)
- [writeFullKriyahCsv](docs/functions/writeFullKriyahCsv.md)
- [writeHolidayMincha](docs/functions/writeHolidayMincha.md)
