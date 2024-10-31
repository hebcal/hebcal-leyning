import {HebrewCalendar} from '@hebcal/core';
import {getLeyningKeyForEvent} from '../src/getLeyningKeyForEvent';

// eslint-disable-next-line require-jsdoc
function dateDescKey(ev) {
  return {
    d: ev.getDate().greg().toISOString().substring(0, 10),
    h: ev.getDesc(),
    k: getLeyningKeyForEvent(ev, true),
  };
}

test('getLeyningKeyForEvent', () => {
  const options = {year: 5757, isHebrewYear: true};
  const events = HebrewCalendar.calendar(options);
  const actual = events.map(dateDescKey);
  const expected = [
    {d: '1996-09-13', h: 'Erev Rosh Hashana', k: undefined},
    {d: '1996-09-14', h: 'Rosh Hashana 5757', k: 'Rosh Hashana I (on Shabbat)'},
    {d: '1996-09-15', h: 'Rosh Hashana II', k: 'Rosh Hashana II'},
    {d: '1996-09-16', h: 'Tzom Gedaliah', k: 'Tzom Gedaliah'},
    {d: '1996-09-21', h: 'Shabbat Shuva', k: 'Shabbat Shuva'},
    {d: '1996-09-22', h: 'Erev Yom Kippur', k: undefined},
    {d: '1996-09-23', h: 'Yom Kippur', k: 'Yom Kippur'},
    {d: '1996-09-27', h: 'Erev Sukkot', k: undefined},
    {d: '1996-09-28', h: 'Sukkot I', k: 'Sukkot I (on Shabbat)'},
    {d: '1996-09-29', h: 'Sukkot II', k: 'Sukkot II'},
    {d: '1996-09-30', h: 'Sukkot III (CH\'\'M)', k: 'Sukkot Chol ha-Moed Day 1'},
    {d: '1996-10-01', h: 'Sukkot IV (CH\'\'M)', k: 'Sukkot Chol ha-Moed Day 2'},
    {d: '1996-10-02', h: 'Sukkot V (CH\'\'M)', k: 'Sukkot Chol ha-Moed Day 3'},
    {d: '1996-10-03', h: 'Sukkot VI (CH\'\'M)', k: 'Sukkot Chol ha-Moed Day 4'},
    {d: '1996-10-04', h: 'Sukkot VII (Hoshana Raba)', k: 'Sukkot Final Day (Hoshana Raba)'},
    {d: '1996-10-05', h: 'Shmini Atzeret', k: 'Simchat Torah (on Shabbat)'},
    {d: '1996-10-06', h: 'Simchat Torah', k: 'Simchat Torah'},
    {d: '1996-10-13', h: 'Rosh Chodesh Cheshvan', k: 'Rosh Chodesh Cheshvan'},
    {d: '1996-10-14', h: 'Rosh Chodesh Cheshvan', k: 'Rosh Chodesh Cheshvan'},
    {d: '1996-11-12', h: 'Rosh Chodesh Kislev', k: 'Rosh Chodesh Kislev'},
    {d: '1996-12-05', h: 'Chanukah: 1 Candle', k: undefined},
    {d: '1996-12-06', h: 'Chanukah: 2 Candles', k: 'Chanukah Day 1'},
    {d: '1996-12-07', h: 'Chanukah: 3 Candles', k: 'Chanukah Day 2 (on Shabbat)'},
    {d: '1996-12-08', h: 'Chanukah: 4 Candles', k: 'Chanukah Day 3'},
    {d: '1996-12-09', h: 'Chanukah: 5 Candles', k: 'Chanukah Day 4'},
    {d: '1996-12-10', h: 'Chanukah: 6 Candles', k: 'Chanukah Day 5'},
    {d: '1996-12-11', h: 'Chag HaBanot', k: undefined},
    {d: '1996-12-11', h: 'Chanukah: 7 Candles', k: 'Chanukah Day 6'},
    {d: '1996-12-11', h: 'Rosh Chodesh Tevet', k: 'Chanukah Day 6'},
    {d: '1996-12-12', h: 'Chanukah: 8 Candles', k: 'Chanukah Day 7'},
    {d: '1996-12-13', h: 'Chanukah: 8th Day', k: 'Chanukah Day 8'},
    {d: '1996-12-20', h: 'Asara B\'Tevet', k: 'Asara B\'Tevet'},
    {d: '1997-01-09', h: 'Rosh Chodesh Sh\'vat', k: 'Rosh Chodesh Sh\'vat'},
    {d: '1997-01-23', h: 'Tu BiShvat', k: undefined},
    {d: '1997-01-25', h: 'Shabbat Shirah', k: undefined},
    {d: '1997-02-07', h: 'Rosh Chodesh Adar I', k: 'Rosh Chodesh Adar I'},
    {d: '1997-02-08', h: 'Rosh Chodesh Adar I', k: 'Shabbat Rosh Chodesh'},
    {d: '1997-02-21', h: 'Purim Katan', k: undefined},
    {d: '1997-02-22', h: 'Shushan Purim Katan', k: undefined},
    {d: '1997-03-08', h: 'Shabbat Shekalim', k: 'Shabbat Shekalim'},
    {d: '1997-03-09', h: 'Rosh Chodesh Adar II', k: 'Rosh Chodesh Adar II'},
    {d: '1997-03-10', h: 'Rosh Chodesh Adar II', k: 'Rosh Chodesh Adar II'},
    {d: '1997-03-20', h: 'Ta\'anit Esther', k: 'Ta\'anit Esther'},
    {d: '1997-03-22', h: 'Shabbat Zachor', k: 'Shabbat Zachor'},
    {d: '1997-03-22', h: 'Erev Purim', k: 'Erev Purim'},
    {d: '1997-03-23', h: 'Purim', k: 'Purim'},
    {d: '1997-03-24', h: 'Shushan Purim', k: 'Shushan Purim'},
    {d: '1997-03-29', h: 'Shabbat Parah', k: 'Shabbat Parah'},
    {d: '1997-04-05', h: 'Shabbat HaChodesh', k: 'Shabbat HaChodesh'},
    {d: '1997-04-08', h: 'Rosh Chodesh Nisan', k: 'Rosh Chodesh Nisan'},
    {d: '1997-04-19', h: 'Shabbat HaGadol', k: 'Shabbat HaGadol'},
    {d: '1997-04-21', h: 'Ta\'anit Bechorot', k: undefined},
    {d: '1997-04-21', h: 'Erev Pesach', k: undefined},
    {d: '1997-04-22', h: 'Pesach I', k: 'Pesach I'},
    {d: '1997-04-23', h: 'Pesach II', k: 'Pesach II'},
    {d: '1997-04-24', h: 'Pesach III (CH\'\'M)', k: 'Pesach III (CH\'\'M)'},
    {d: '1997-04-25', h: 'Pesach IV (CH\'\'M)', k: 'Pesach IV (CH\'\'M)'},
    {d: '1997-04-26', h: 'Pesach V (CH\'\'M)', k: 'Pesach Shabbat Chol ha-Moed'},
    {d: '1997-04-27', h: 'Pesach VI (CH\'\'M)', k: 'Pesach VI (CH\'\'M)'},
    {d: '1997-04-28', h: 'Pesach VII', k: 'Pesach VII'},
    {d: '1997-04-29', h: 'Pesach VIII', k: 'Pesach VIII'},
    {d: '1997-05-05', h: 'Yom HaShoah', k: undefined},
    {d: '1997-05-07', h: 'Rosh Chodesh Iyyar', k: 'Rosh Chodesh Iyyar'},
    {d: '1997-05-08', h: 'Rosh Chodesh Iyyar', k: 'Rosh Chodesh Iyyar'},
    {d: '1997-05-11', h: 'Yom HaZikaron', k: undefined},
    {d: '1997-05-12', h: 'Yom HaAtzma\'ut', k: undefined},
    {d: '1997-05-21', h: 'Pesach Sheni', k: undefined},
    {d: '1997-05-25', h: 'Lag BaOmer', k: undefined},
    {d: '1997-06-04', h: 'Yom Yerushalayim', k: undefined},
    {d: '1997-06-06', h: 'Rosh Chodesh Sivan', k: 'Rosh Chodesh Sivan'},
    {d: '1997-06-10', h: 'Erev Shavuot', k: undefined},
    {d: '1997-06-11', h: 'Shavuot I', k: 'Shavuot I'},
    {d: '1997-06-12', h: 'Shavuot II', k: 'Shavuot II'},
    {d: '1997-07-05', h: 'Rosh Chodesh Tamuz', k: 'Shabbat Rosh Chodesh'},
    {d: '1997-07-06', h: 'Rosh Chodesh Tamuz', k: 'Rosh Chodesh Tamuz'},
    {d: '1997-07-22', h: 'Tzom Tammuz', k: 'Tzom Tammuz'},
    {d: '1997-08-04', h: 'Rosh Chodesh Av', k: 'Rosh Chodesh Av'},
    {d: '1997-08-09', h: 'Shabbat Chazon', k: undefined},
    {d: '1997-08-11', h: 'Erev Tish\'a B\'Av', k: 'Erev Tish\'a B\'Av'},
    {d: '1997-08-12', h: 'Tish\'a B\'Av', k: 'Tish\'a B\'Av'},
    {d: '1997-08-16', h: 'Shabbat Nachamu', k: undefined},
    {d: '1997-08-18', h: 'Tu B\'Av', k: undefined},
    {d: '1997-09-02', h: 'Rosh Chodesh Elul', k: 'Rosh Chodesh Elul'},
    {d: '1997-09-03', h: 'Rosh Hashana LaBehemot', k: undefined},
    {d: '1997-09-03', h: 'Rosh Chodesh Elul', k: 'Rosh Chodesh Elul'},
    {d: '1997-09-27', h: 'Leil Selichot', k: undefined},
    {d: '1997-10-01', h: 'Erev Rosh Hashana', k: undefined},

  ];
  expect(actual).toEqual(expected);
});

test('getLeyningKeyForEvent-pesach-il', () => {
  const events0 = HebrewCalendar.calendar({year: 5780, isHebrewYear: true, il: true, numYears: 3});
  const events = events0.filter((ev) => ev.basename() === 'Pesach');
  const actual = events.map(dateDescKey);
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
  expect(actual).toEqual(expected);
});

test('getLeyningKeyForEvent-pesach-diaspora', () => {
  const events0 = HebrewCalendar.calendar({year: 5783, isHebrewYear: true, il: false});
  const events = events0.filter((ev) => ev.basename() === 'Pesach');
  const actual = events.map((ev) => {
    return {
      d: ev.getDate().greg().toISOString().substring(0, 10),
      h: ev.getDesc(),
      k: getLeyningKeyForEvent(ev, false),
    };
  });
  const expected = [
    {d: '2023-04-05', h: 'Erev Pesach', k: undefined},
    {d: '2023-04-06', h: 'Pesach I', k: 'Pesach I'},
    {d: '2023-04-07', h: 'Pesach II', k: 'Pesach II'},
    {d: '2023-04-08', h: 'Pesach III (CH\'\'M)', k: 'Pesach Shabbat Chol ha-Moed'},
    {d: '2023-04-09', h: 'Pesach IV (CH\'\'M)', k: 'Pesach Chol ha-Moed Day 2 on Sunday'},
    {d: '2023-04-10', h: 'Pesach V (CH\'\'M)', k: 'Pesach Chol ha-Moed Day 3 on Monday'},
    {d: '2023-04-11', h: 'Pesach VI (CH\'\'M)', k: 'Pesach Chol ha-Moed Day 4'},
    {d: '2023-04-12', h: 'Pesach VII', k: 'Pesach VII'},
    {d: '2023-04-13', h: 'Pesach VIII', k: 'Pesach VIII'},
  ];
  expect(actual).toEqual(expected);
});
