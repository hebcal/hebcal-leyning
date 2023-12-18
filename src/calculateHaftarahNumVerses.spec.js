import test from 'ava';
import {calculateHaftarahNumVerses} from './calculateHaftarahNumVerses.js';

test('calculateHaftarahNumVerses', (t) => {
  t.is(calculateHaftarahNumVerses('Ezekiel 1:1 - 1:28'), 28);
  t.is(calculateHaftarahNumVerses('Ezekiel 1:1-1:28'), 28);
  t.is(calculateHaftarahNumVerses('Ezekiel 1:1-28'), 28);
  t.is(calculateHaftarahNumVerses('Ezekiel 1:1 - 1:28, 3:12'), 29);
  t.is(calculateHaftarahNumVerses('Ezekiel 1:1 - 1:28; 3:12'), 29);
  t.is(calculateHaftarahNumVerses('Ezekiel 1:1-28, 3:12'), 29);
  t.is(calculateHaftarahNumVerses('Ezekiel 1:1 - 1:28; Ezekiel 3:12'), 29);
  t.is(calculateHaftarahNumVerses('Joshua 5:2-6:1'), 15);
  t.is(calculateHaftarahNumVerses('II Kings 23:1 - 23:9; 23:21 - 23:25'), 14);
  t.is(calculateHaftarahNumVerses('II Kings 23:1-9; 23:21-25'), 14);
});
