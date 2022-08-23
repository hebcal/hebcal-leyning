import test from 'ava';
import {makeLeyningSummary} from './summary';

test('mls-Noach', (t) => {
  const fullkriyah = {
    '1': {k: 'Genesis', b: '6:9', e: '6:22'},
    '2': {k: 'Genesis', b: '7:1', e: '7:16'},
    '3': {k: 'Genesis', b: '7:17', e: '8:14'},
    '4': {k: 'Genesis', b: '8:15', e: '9:7'},
    '5': {k: 'Genesis', b: '9:8', e: '9:17'},
    '6': {k: 'Genesis', b: '9:18', e: '10:32'},
    '7': {k: 'Genesis', b: '11:1', e: '11:32'},
    'M': {k: 'Genesis', b: '11:29', e: '11:32'},
  };
  const summary = makeLeyningSummary(fullkriyah, true);
  t.is(summary, 'Genesis 6:9-11:32');
});

test('mls-Vayakhel-Pekudei on Shabbat HaChodesh', (t) => {
  const fullkriyah = {
    '1': {k: 'Exodus', b: '35:1', e: '35:29', v: 29},
    '2': {k: 'Exodus', b: '35:30', e: '37:16', v: 60},
    '3': {k: 'Exodus', b: '37:17', e: '37:29', v: 13},
    '4': {k: 'Exodus', b: '38:1', e: '39:1', v: 32},
    '5': {k: 'Exodus', b: '39:2', e: '39:21', v: 20},
    '6': {k: 'Exodus', b: '39:22', e: '39:43', v: 22},
    '7': {k: 'Exodus', b: '40:1', e: '40:38', v: 38},
    'M': {p: 15, k: 'Exodus', b: '12:1', e: '12:20', v: 20},
  };
  const summary = makeLeyningSummary(fullkriyah, true);
  t.is(summary, 'Exodus 35:1-40:38, 12:1-20');
});

test('mls-Shmini Atzeret (on Shabbat)', (t) => {
  const fullkriyah = {
    '1': {'p': 47, 'k': 'Deuteronomy', 'b': '14:22', 'e': '14:29'},
    '2': {'p': 47, 'k': 'Deuteronomy', 'b': '15:1', 'e': '15:18'},
    '3': {'p': 47, 'k': 'Deuteronomy', 'b': '15:19', 'e': '15:23'},
    '4': {'p': 47, 'k': 'Deuteronomy', 'b': '16:1', 'e': '16:3'},
    '5': {'p': 47, 'k': 'Deuteronomy', 'b': '16:4', 'e': '16:8'},
    '6': {'p': 47, 'k': 'Deuteronomy', 'b': '16:9', 'e': '16:12'},
    '7': {'p': 47, 'k': 'Deuteronomy', 'b': '16:13', 'e': '16:17'},
    'M': {'p': 41, 'k': 'Numbers', 'b': '29:35', 'e': '30:1'},
  };
  const summary = makeLeyningSummary(fullkriyah, true);
  t.is(summary, 'Deuteronomy 14:22-16:17; Numbers 29:35-30:1');
});

test('mls-Chanukah Day 6', (t) => {
  const fullkriyah = {
    '1': {'p': 41, 'k': 'Numbers', 'b': '28:1', 'e': '28:5'},
    '2': {'p': 41, 'k': 'Numbers', 'b': '28:6', 'e': '28:10'},
    '3': {'p': 41, 'k': 'Numbers', 'b': '28:11', 'e': '28:15'},
    'M': {'p': 35, 'k': 'Numbers', 'b': '7:42', 'e': '7:47'},
  };
  const summary = makeLeyningSummary(fullkriyah, true);
  t.is(summary, 'Numbers 28:1-15, 7:42-47');
});

test('mls-Shabbat Shekalim', (t) => {
  const fullkriyah = {
    'M': {'p': 21, 'k': 'Exodus', 'b': '30:11', 'e': '30:16'},
  };
  const summary = makeLeyningSummary(fullkriyah, true);
  t.is(summary, 'Exodus 30:11-16');
});

test('mls-Tzom Gedaliah', (t) => {
  const fullkriyah = {
    '1': {'p': 21, 'k': 'Exodus', 'b': '32:11', 'e': '32:14'},
    '2': {'p': 21, 'k': 'Exodus', 'b': '34:1', 'e': '34:3'},
    '3': {'p': 21, 'k': 'Exodus', 'b': '34:4', 'e': '34:10'},
  };
  const summary = makeLeyningSummary(fullkriyah, true);
  t.is(summary, 'Exodus 32:11-14, 34:1-10');
});
