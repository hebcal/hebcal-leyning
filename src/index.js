import {
  getLeyningForHoliday,
  getLeyningForHolidayKey,
  getLeyningForParshaHaShavua,
  getLeyningKeyForEvent,
  formatAliyahWithBook,
} from './leyning';
import {getTriennialForParshaHaShavua, getTriennial, Triennial} from './triennial';
import {writeFullKriyahCsv, writeTriennialCsv} from './csv';
import {addSefariaLinksToLeyning} from './common';
import parshiyotObj from './aliyot.json';
import festivals from './holiday-readings.json';

/** Main interface to hebcal/leyning */
const leyning = {
  Triennial,
  getTriennial,
  getTriennialForParshaHaShavua,
  getLeyningForHoliday,
  getLeyningForHolidayKey,
  getLeyningForParshaHaShavua,
  getLeyningKeyForEvent,
  formatAliyahWithBook,
  writeFullKriyahCsv,
  writeTriennialCsv,
  addSefariaLinksToLeyning,
  parshiyot: parshiyotObj,
  holidayReadings: festivals,
};

export default leyning;
