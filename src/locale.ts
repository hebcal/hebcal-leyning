import {Locale, LocaleData, StringArrayMap} from '@hebcal/core';
import poHe from './he.po';

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
