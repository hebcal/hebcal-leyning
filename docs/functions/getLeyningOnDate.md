[**@hebcal/leyning**](../README.md) • **Docs**

***

[@hebcal/leyning](../globals.md) / getLeyningOnDate

# Function: getLeyningOnDate()

> **getLeyningOnDate**(`hdate`, `il`, `wantarray`?): [`Leyning`](../type-aliases/Leyning.md) \| [`LeyningWeekday`](../type-aliases/LeyningWeekday.md) \| ([`Leyning`](../type-aliases/Leyning.md) \| [`LeyningWeekday`](../type-aliases/LeyningWeekday.md))[] \| `undefined`

Looks up leyning for a regular Shabbat, Monday/Thursday weekday or holiday.

If `hdate` coincides with a holiday that has Torah reading, returns the
reading for that day (see [getLeyningForHoliday](getLeyningForHoliday.md))

Otherwise, if `hdate` is a Saturday, returns [getLeyningForParshaHaShavua](getLeyningForParshaHaShavua.md)

Otherwise, if `hdate` is a Monday or Thursday, returns [Leyning](../type-aliases/Leyning.md) for the
Parashat haShavua, containing only the `weekday` aliyot (no `fullkriyah`).

Otherwise, returns `undefined`.

## Parameters

• **hdate**: `HDate`

Hebrew Date

• **il**: `boolean`

in Israel

• **wantarray?**: `boolean` = `false`

to return an array of 0 or more readings

## Returns

[`Leyning`](../type-aliases/Leyning.md) \| [`LeyningWeekday`](../type-aliases/LeyningWeekday.md) \| ([`Leyning`](../type-aliases/Leyning.md) \| [`LeyningWeekday`](../type-aliases/LeyningWeekday.md))[] \| `undefined`

## Defined in

[getLeyningOnDate.ts:61](https://github.com/hebcal/hebcal-leyning/blob/40b5eb1606b3ea086311ad0bbcf740bb6031ecb8/src/getLeyningOnDate.ts#L61)
