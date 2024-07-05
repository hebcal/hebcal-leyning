[**@hebcal/leyning**](../README.md) • **Docs**

***

[@hebcal/leyning](../globals.md) / getLeyningForHolidayKey

# Function: getLeyningForHolidayKey()

> **getLeyningForHolidayKey**(`key`?, `cholHaMoedDay`?, `il`?): [`Leyning`](../type-aliases/Leyning.md) \| `undefined`

Looks up leyning for a given holiday key. Key should be an
(untranslated) string used in holiday-readings.json. Returns some
of full kriyah aliyot, special Maftir, special Haftarah

## Parameters

• **key?**: `string`

name from `holiday-readings.json` to find

• **cholHaMoedDay?**: `number`

• **il?**: `boolean`

## Returns

[`Leyning`](../type-aliases/Leyning.md) \| `undefined`

## Defined in

[getLeyningForHoliday.ts:24](https://github.com/hebcal/hebcal-leyning/blob/686daf91ca80e1487976aba775587a09727384c4/src/getLeyningForHoliday.ts#L24)
