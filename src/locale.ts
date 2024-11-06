import {Locale} from '@hebcal/core/dist/esm/locale';
import {LocaleData, StringArrayMap} from '@hebcal/hdate';
import poHe from './he.po';

export {Locale};

Locale.addTranslations('he', poHe);
Locale.addTranslations('h', poHe);

const heStrs = poHe.contexts[''];
const heNoNikud: StringArrayMap = {};
for (const [key, val] of Object.entries(heStrs)) {
  heNoNikud[key] = [Locale.hebrewStripNikkud(val[0])];
}
const poHeNoNikud: LocaleData = {
  headers: poHe.headers,
  contexts: {'': heNoNikud},
};
Locale.addTranslations('he-x-NoNikud', poHeNoNikud);
