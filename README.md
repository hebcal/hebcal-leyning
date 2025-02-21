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
  if (aliyah.reason) {
      str += ' | ' + aliyah.reason;
  }
  str += ` (${aliyah.v} verses)`;
  console.log(`${number}: ${str}`);
}
```
## [API Documentation](https://hebcal.github.io/api/leyning/index.html)
