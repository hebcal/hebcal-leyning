import {Locale} from '@hebcal/core/dist/esm/locale';
import poHe from './he.po';
import poAshkenazi from './ashkenazi.po';

export {Locale};

Locale.addTranslations('ashkenazi', poAshkenazi);

Locale.addTranslations('he', poHe);

const poHeNoNikud = Locale.copyLocaleNoNikud(poHe);
Locale.addTranslations('he-x-NoNikud', poHeNoNikud);
