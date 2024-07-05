[**@hebcal/leyning**](../README.md) • **Docs**

***

[@hebcal/leyning](../globals.md) / specialReadings2

# Function: specialReadings2()

> **specialReadings2**(`parsha`, `hd`, `il`, `aliyot`): [`SpecialReading`](../type-aliases/SpecialReading.md)

Determines if the regular parashat haShavua coincides with an event that requires
a special maftir or Haftara (for example Shabbat HaGadol, Shabbat Chanukah, Rosh
Chodesh or Machar Chodesh, etc.).

This function does not modify `aliyot`. Instead, it returns a deep copy
with `aliyot['M']` replaced and sets `reason.M`
(and in some cases the 6th and 7th aliyah, setting `reason['7']`).

If a special Haftarah applies, the result will have a `haft` property
pointing to Haftarah object and sets `reason.haftara`.

## Parameters

• **parsha**: `string`[]

• **hd**: `HDate`

• **il**: `boolean`

• **aliyot**: [`AliyotMap`](../type-aliases/AliyotMap.md)

## Returns

[`SpecialReading`](../type-aliases/SpecialReading.md)

## Defined in

[specialReadings.ts:49](https://github.com/hebcal/hebcal-leyning/blob/40b5eb1606b3ea086311ad0bbcf740bb6031ecb8/src/specialReadings.ts#L49)
