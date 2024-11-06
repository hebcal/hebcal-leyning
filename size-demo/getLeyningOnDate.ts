import {HDate} from '@hebcal/hdate';
import {getLeyningOnDate} from '../dist/esm/getLeyningOnDate';
console.log(getLeyningOnDate(new HDate(1, 1, 5757), false));
