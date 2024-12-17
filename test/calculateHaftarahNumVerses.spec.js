import {expect, test} from 'vitest';
import {calculateHaftarahNumVerses} from '../src/calculateHaftarahNumVerses';

test('calculateHaftarahNumVerses', () => {
  expect(calculateHaftarahNumVerses('Ezekiel 1:1 - 1:28')).toBe(28);
  expect(calculateHaftarahNumVerses('Ezekiel 1:1-1:28')).toBe(28);
  expect(calculateHaftarahNumVerses('Ezekiel 1:1-28')).toBe(28);
  expect(calculateHaftarahNumVerses('Ezekiel 1:1 - 1:28, 3:12')).toBe(29);
  expect(calculateHaftarahNumVerses('Ezekiel 1:1 - 1:28; 3:12')).toBe(29);
  expect(calculateHaftarahNumVerses('Ezekiel 1:1-28, 3:12')).toBe(29);
  expect(calculateHaftarahNumVerses('Ezekiel 1:1 - 1:28; Ezekiel 3:12')).toBe(29);
  expect(calculateHaftarahNumVerses('Joshua 5:2-6:1')).toBe(15);
  expect(calculateHaftarahNumVerses('II Kings 23:1 - 23:9; 23:21 - 23:25')).toBe(14);
  expect(calculateHaftarahNumVerses('II Kings 23:1-9; 23:21-25')).toBe(14);
});
