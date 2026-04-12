import {Locale} from '@hebcal/core/dist/esm/locale';
import poHe from './he.po';
import poAshkenazi from './ashkenazi.po';
import noNikudOverride from './he-x-NoNikud.po';

Locale.addTranslations('ashkenazi', poAshkenazi);

Locale.addTranslations('he', poHe);

/* Hebrew without nikkud */
const poHeNoNikud = Locale.copyLocaleNoNikud(poHe);
Locale.addTranslations('he-x-NoNikud', poHeNoNikud);
Locale.addTranslations('he-x-NoNikud', noNikudOverride);

export {Locale} from '@hebcal/core/dist/esm/locale';
