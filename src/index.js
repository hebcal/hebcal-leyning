import {
  getLeyningForHoliday,
  getLeyningForParshaHaShavua,
  getLeyningKeyForEvent,
  formatAliyahWithBook,
} from './leyning';
import {getTriennialForParshaHaShavua, getTriennial, Triennial} from './triennial';

/** Main interface to hebcal/leyning */
const leyning = {
  Triennial,
  getTriennial,
  getTriennialForParshaHaShavua,
  getLeyningForHoliday,
  getLeyningForParshaHaShavua,
  getLeyningKeyForEvent,
  formatAliyahWithBook,
};

export default leyning;
