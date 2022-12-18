import test from 'ava';
import {HDate, ParshaEvent} from '@hebcal/core';
import {getLeyningForParshaHaShavua} from './leyning';

test('Shabbat Zachor', (t) => {
  const hd = new HDate(new Date(2024, 2, 23));
  const pe = new ParshaEvent(hd, ['Vayikra'], false);
  const reading = getLeyningForParshaHaShavua(pe, false);
  const expected = {
    name: {en: 'Vayikra', he: 'וַיִּקְרָא'},
    parsha: ['Vayikra'],
    parshaNum: 24,
    summary: 'Leviticus 1:1-5:26; Deuteronomy 25:17-19',
    fullkriyah: {
      '1': {k: 'Leviticus', b: '1:1', e: '1:13', v: 13},
      '2': {k: 'Leviticus', b: '1:14', e: '2:6', v: 10},
      '3': {k: 'Leviticus', b: '2:7', e: '2:16', v: 10},
      '4': {k: 'Leviticus', b: '3:1', e: '3:17', v: 17},
      '5': {k: 'Leviticus', b: '4:1', e: '4:26', v: 26},
      '6': {k: 'Leviticus', b: '4:27', e: '5:10', v: 19},
      '7': {k: 'Leviticus', b: '5:11', e: '5:26', v: 16},
      'M': {
        p: 49,
        k: 'Deuteronomy',
        b: '25:17',
        e: '25:19',
        v: 3,
        reason: 'Shabbat Zachor',
      },
    },
    haft: {
      k: 'I Samuel',
      b: '15:2',
      e: '15:34',
      v: 33,
      reason: 'Shabbat Zachor',
    },
    haftara: 'I Samuel 15:2-34',
    haftaraNumV: 33,
    summaryParts: [
      {k: 'Leviticus', b: '1:1', e: '5:26'},
      {k: 'Deuteronomy', b: '25:17', e: '25:19'},
    ],
    reason: {haftara: 'Shabbat Zachor', M: 'Shabbat Zachor'},
  };
  t.deepEqual(reading, expected);
});
