import {HDate} from '@hebcal/hdate';
import {getLeyningOnDate} from '../dist/es/getLeyningOnDate';
console.log(getLeyningOnDate(new HDate(1, 1, 5757), false));
