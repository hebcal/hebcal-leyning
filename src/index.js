import {
  getLeyningForHoliday,
  getLeyningForParshaHaShavua,
  getLeyningKeyForEvent,
  formatAliyahWithBook,
} from './leyning';
import {getTriennial, Triennial} from './triennial';

/** Main interface to hebcal/leyning */
const leyning = {
  Triennial,
  getTriennial,
  getLeyningForHoliday,
  getLeyningForParshaHaShavua,
  getLeyningKeyForEvent,
  formatAliyahWithBook,
};

export default leyning;
