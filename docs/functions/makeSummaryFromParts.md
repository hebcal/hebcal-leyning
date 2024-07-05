[**@hebcal/leyning**](../README.md) • **Docs**

***

[@hebcal/leyning](../globals.md) / makeSummaryFromParts

# Function: makeSummaryFromParts()

> **makeSummaryFromParts**(`parts`): `string`

Returns a string representation of the leyning parts.
Separate verse ranges read from the same book are separated
by commas, e.g. `Isaiah 6:1-7:6, 9:5-6`.
Verse ranges from different books are separated by semicolons,
e.g. `Genesis 21:1-34; Numbers 29:1-6`.

## Parameters

• **parts**: [`Aliyah`](../type-aliases/Aliyah.md) \| [`Aliyah`](../type-aliases/Aliyah.md)[]

## Returns

`string`

## Defined in

[summary.ts:56](https://github.com/hebcal/hebcal-leyning/blob/686daf91ca80e1487976aba775587a09727384c4/src/summary.ts#L56)
