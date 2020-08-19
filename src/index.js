import {
  getLeyningForHoliday,
  getLeyningForParshaHaShavua,
  getLeyningKeyForEvent,
  formatAliyahWithBook,
} from './leyning';
import {getTriennialForParshaHaShavua, getTriennial, Triennial} from './triennial';
import {writeFullKriyahCsv, writeTriennialCsv} from './csv';
import parshiyotObj from './aliyot.json';
import festivals from './holiday-readings.json';

/** Main interface to hebcal/leyning */
const leyning = {
  Triennial,
  getTriennial,
  getTriennialForParshaHaShavua,
  getLeyningForHoliday,
  getLeyningForParshaHaShavua,
  getLeyningKeyForEvent,
  formatAliyahWithBook,
  writeFullKriyahCsv,
  writeTriennialCsv,
  parshiyot: parshiyotObj,
  holidayReadings: festivals,
};

export default leyning;
