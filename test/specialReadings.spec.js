import {expect, test} from 'vitest';
import {HDate} from '@hebcal/hdate';
import {specialReadings2} from '../src/specialReadings';
import {getLeyningForParsha} from '../src/leyning';

test('specialReadings-none', () => {
  const hd = new HDate(13, 'Iyyar', 5783);
  const parsha = ['Behar', 'Bechukotai'];
  const aliyot = getLeyningForParsha(parsha).fullkriyah;
  const reading = specialReadings2(parsha, hd, false, aliyot);
  expect(reading.aliyot).toEqual(aliyot);
  expect(reading.reason).toEqual({});
  expect(reading.haft).toBeUndefined();
  expect(reading.seph).toBeUndefined();
});

test('specialReadings-machar-chodesh', () => {
  const hd = new HDate(29, 'Iyyar', 5783);
  const parsha = ['Bamidbar'];
  const aliyot = getLeyningForParsha(parsha).fullkriyah;
  const reading = specialReadings2(parsha, hd, false, aliyot);
  expect(reading.reason).toEqual({haftara: 'Shabbat Machar Chodesh'});
  expect(reading.haft.k).toBe('I Samuel');
  expect(reading.haft.b).toBe('20:18');
  expect(reading.haft.e).toBe('20:42');
});

test('specialReadings-rosh-chodesh', () => {
  const hd = new HDate(1, 'Elul', 5783);
  const parsha = ['Re\'eh'];
  const aliyot = getLeyningForParsha(parsha).fullkriyah;
  const reading = specialReadings2(parsha, hd, false, aliyot);
  expect(reading.reason).toEqual({
    'M': 'Shabbat Rosh Chodesh',
    'haftara': 'Shabbat Rosh Chodesh',
  });
  expect(reading.aliyot['M'].k).toBe('Numbers');
  expect(reading.haft.k).toBe('Isaiah');
});
