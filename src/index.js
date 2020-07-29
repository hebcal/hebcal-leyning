import {
  getLeyningForHoliday,
  getLeyningForParshaHaShavua,
  getLeyningKeyForEvent,
  formatAliyahWithBook,
} from './leyning';
import {getTriennialForParshaHaShavua, getTriennial, Triennial} from './triennial';
import {writeFullKriyahCsv} from './csv';

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
};

export default leyning;
