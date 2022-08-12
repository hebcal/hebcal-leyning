import test from 'ava';
import {HebrewCalendar} from '@hebcal/core';
import {getLeyningKeyForEvent} from './getLeyningKeyForEvent';

test('getLeyningKeyForEvent', (t) => {
  const options = {year: 5757, isHebrewYear: true};
  const events = HebrewCalendar.calendar(options);
  const keys = {};
  for (const ev of events) {
    keys[ev.getDesc()] = getLeyningKeyForEvent(ev);
  }
  const expected = {
    'Erev Rosh Hashana': undefined,
    'Rosh Hashana 5757': 'Rosh Hashana I (on Shabbat)',
    'Rosh Hashana II': 'Rosh Hashana II',
    'Tzom Gedaliah': 'Tzom Gedaliah',
    'Shabbat Shuva': 'Shabbat Shuva',
    'Erev Yom Kippur': undefined,
    'Yom Kippur': 'Yom Kippur',
    'Erev Sukkot': undefined,
    'Sukkot I': 'Sukkot I (on Shabbat)',
    'Sukkot II': 'Sukkot II',
    'Sukkot III (CH\'\'M)': 'Sukkot Chol ha-Moed Day 1',
    'Sukkot IV (CH\'\'M)': 'Sukkot Chol ha-Moed Day 2',
    'Sukkot V (CH\'\'M)': 'Sukkot Chol ha-Moed Day 3',
    'Sukkot VI (CH\'\'M)': 'Sukkot Chol ha-Moed Day 4',
    'Sukkot VII (Hoshana Raba)': 'Sukkot Final Day (Hoshana Raba)',
    'Shmini Atzeret': 'Shmini Atzeret (on Shabbat)',
    'Simchat Torah': 'Simchat Torah',
    'Rosh Chodesh Cheshvan': 'Rosh Chodesh Cheshvan',
    'Rosh Chodesh Kislev': 'Rosh Chodesh Kislev',
    'Chanukah: 1 Candle': undefined,
    'Chanukah: 2 Candles': 'Chanukah Day 1',
    'Chanukah: 3 Candles': 'Chanukah Day 2',
    'Chanukah: 4 Candles': 'Chanukah Day 3',
    'Chanukah: 5 Candles': 'Chanukah Day 4',
    'Chanukah: 6 Candles': 'Chanukah Day 5',
    'Chanukah: 7 Candles': 'Chanukah Day 6',
    'Rosh Chodesh Tevet': 'Chanukah Day 6', // allow duplicate with Chanukah
    'Chanukah: 8 Candles': 'Chanukah Day 7',
    'Chanukah: 8th Day': 'Chanukah Day 8',
    'Asara B\'Tevet': 'Asara B\'Tevet',
    'Rosh Chodesh Sh\'vat': 'Rosh Chodesh Sh\'vat',
    'Tu BiShvat': undefined,
    'Rosh Chodesh Adar I': 'Shabbat Rosh Chodesh',
    'Purim Katan': undefined,
    'Shabbat Shekalim': 'Shabbat Shekalim',
    'Shabbat Shirah': undefined,
    'Rosh Chodesh Adar II': 'Rosh Chodesh Adar II',
    'Ta\'anit Esther': 'Ta\'anit Esther',
    'Shabbat Zachor': 'Shabbat Zachor',
    'Erev Purim': undefined,
    'Purim': 'Purim',
    'Shushan Purim': 'Shushan Purim',
    'Shabbat Parah': 'Shabbat Parah',
    'Shabbat HaChodesh': 'Shabbat HaChodesh',
    'Rosh Chodesh Nisan': 'Rosh Chodesh Nisan',
    'Shabbat HaGadol': 'Shabbat HaGadol',
    'Ta\'anit Bechorot': 'Ta\'anit Bechorot',
    'Erev Pesach': undefined,
    'Pesach I': 'Pesach I',
    'Pesach II': 'Pesach II',
    'Pesach III (CH\'\'M)': 'Pesach Chol ha-Moed Day 1',
    'Pesach IV (CH\'\'M)': 'Pesach Chol ha-Moed Day 2',
    'Pesach V (CH\'\'M)': 'Pesach Shabbat Chol ha-Moed',
    'Pesach VI (CH\'\'M)': 'Pesach Chol ha-Moed Day 3',
    'Pesach VII': 'Pesach VII',
    'Pesach VIII': 'Pesach VIII',
    'Yom HaShoah': undefined,
    'Rosh Chodesh Iyyar': 'Rosh Chodesh Iyyar',
    'Yom HaZikaron': undefined,
    'Yom HaAtzma\'ut': undefined,
    'Pesach Sheni': undefined,
    'Lag BaOmer': undefined,
    'Yom Yerushalayim': undefined,
    'Rosh Chodesh Sivan': 'Rosh Chodesh Sivan',
    'Erev Shavuot': undefined,
    'Shavuot I': 'Shavuot I',
    'Shavuot II': 'Shavuot II',
    'Rosh Chodesh Tamuz': 'Rosh Chodesh Tamuz',
    'Tzom Tammuz': 'Tzom Tammuz',
    'Rosh Chodesh Av': 'Rosh Chodesh Av',
    'Shabbat Chazon': undefined,
    'Erev Tish\'a B\'Av': undefined,
    'Tish\'a B\'Av': 'Tish\'a B\'Av',
    'Shabbat Nachamu': undefined,
    'Tu B\'Av': undefined,
    'Rosh Chodesh Elul': 'Rosh Chodesh Elul',
    'Leil Selichot': undefined,
    'Rosh Hashana LaBehemot': undefined,
  };
  t.deepEqual(keys, expected);
});

test('getLeyningKeyForEvent-pesach-il', (t) => {
  const events0 = HebrewCalendar.calendar({year: 5780, isHebrewYear: true, il: true, numYears: 3});
  const events = events0.filter((ev) => ev.basename() === 'Pesach');
  const actual = [];
  for (const ev of events) {
    actual.push({
      d: ev.getDate().greg().toISOString().substring(0, 10),
      h: ev.getDesc(),
      k: getLeyningKeyForEvent(ev, true),
    });
  }
  const expected = [
    {d: '2020-04-08', h: 'Erev Pesach', k: undefined},
    {d: '2020-04-09', h: 'Pesach I', k: 'Pesach I'},
    {d: '2020-04-10', h: 'Pesach II (CH\'\'M)', k: 'Pesach II (CH\'\'M)'},
    {d: '2020-04-11', h: 'Pesach III (CH\'\'M)', k: 'Pesach Shabbat Chol ha-Moed'},
    {d: '2020-04-12', h: 'Pesach IV (CH\'\'M)', k: 'Pesach IV (CH\'\'M)'},
    {d: '2020-04-13', h: 'Pesach V (CH\'\'M)', k: 'Pesach V (CH\'\'M)'},
    {d: '2020-04-14', h: 'Pesach VI (CH\'\'M)', k: 'Pesach VI (CH\'\'M)'},
    {d: '2020-04-15', h: 'Pesach VII', k: 'Pesach VII'},

    {d: '2021-03-27', h: 'Erev Pesach', k: undefined},
    {d: '2021-03-28', h: 'Pesach I', k: 'Pesach I'},
    {d: '2021-03-29', h: 'Pesach II (CH\'\'M)', k: 'Pesach II (CH\'\'M)'},
    {d: '2021-03-30', h: 'Pesach III (CH\'\'M)', k: 'Pesach III (CH\'\'M)'},
    {d: '2021-03-31', h: 'Pesach IV (CH\'\'M)', k: 'Pesach IV (CH\'\'M)'},
    {d: '2021-04-01', h: 'Pesach V (CH\'\'M)', k: 'Pesach V (CH\'\'M)'},
    {d: '2021-04-02', h: 'Pesach VI (CH\'\'M)', k: 'Pesach VI (CH\'\'M)'},
    {d: '2021-04-03', h: 'Pesach VII', k: 'Pesach VII (on Shabbat)'},

    {d: '2022-04-15', h: 'Erev Pesach', k: undefined},
    {d: '2022-04-16', h: 'Pesach I', k: 'Pesach I (on Shabbat)'},
    {d: '2022-04-17', h: 'Pesach II (CH\'\'M)', k: 'Pesach II (CH\'\'M)'},
    {d: '2022-04-18', h: 'Pesach III (CH\'\'M)', k: 'Pesach III (CH\'\'M)'},
    {d: '2022-04-19', h: 'Pesach IV (CH\'\'M)', k: 'Pesach IV (CH\'\'M)'},
    {d: '2022-04-20', h: 'Pesach V (CH\'\'M)', k: 'Pesach V (CH\'\'M)'},
    {d: '2022-04-21', h: 'Pesach VI (CH\'\'M)', k: 'Pesach VI (CH\'\'M)'},
    {d: '2022-04-22', h: 'Pesach VII', k: 'Pesach VII'},
  ];
  t.deepEqual(actual, expected);
});
