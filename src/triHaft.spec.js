import test from 'ava';
import triennialHaft from './triennial-haft.json';
import numverses from './numverses.json';

// eslint-disable-next-line require-jsdoc
function testAliyah(t, name, haft) {
  if (typeof haft === 'undefined') {
    t.fail(`${name} => <undefined>`);
  }
  if (Array.isArray(haft)) {
    for (const aliyah of haft) {
      const numv = numverses[aliyah.k];
      t.is(typeof numv, 'object', `${name} => ${aliyah.k}`);
    }
  } else {
    const numv = numverses[haft.k];
    t.is(typeof numv, 'object', `${name} => ${haft.k}`);
  }
}

test('triennial-haft-spelling', (t) => {
  for (const [parsha, triHaft] of Object.entries(triennialHaft)) {
    if (parsha === '_holidays' || typeof triHaft === 'boolean') {
      continue;
    }
    testAliyah(t, parsha, triHaft['1']);
    testAliyah(t, parsha, triHaft['2']);
    if (triHaft['3']) {
      testAliyah(t, parsha, triHaft['3']);
    }
  }
  for (const [holiday, haft] of Object.entries(triennialHaft._holidays)) {
    testAliyah(t, holiday, haft);
  }
});
