import test from 'ava';
import {Triennial} from './triennial';

test('triennial', (t) => {
  const tri = new Triennial(5780);
  const readings = tri.getReadings();
  const parsha = readings.get('Vayakhel-Pekudei');
  t.is(parsha.length, 2);
  t.is(parsha[0]['7'].book, 'Exodus');
  t.is(parsha[0]['7'].begin, '37:1');
  t.is(parsha[0]['7'].end, '37:16');
  t.is(parsha[1]['7'].book, 'Exodus');
  t.is(parsha[1]['7'].begin, '39:8');
  t.is(parsha[1]['7'].end, '39:21');
});
