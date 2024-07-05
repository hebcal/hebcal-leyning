[**@hebcal/leyning**](../README.md) • **Docs**

***

[@hebcal/leyning](../globals.md) / ParshaMeta

# Type Alias: ParshaMeta

> **ParshaMeta**: `object`

Parsha metadata (underlying JSON object)

## Type declaration

### book

> **book**: `number`

1 for Genesis, 2 for Exodus, 5 for Deuteronomy

### combined?

> `optional` **combined**: `boolean`

### fullkriyah

> **fullkriyah**: `object`

Map of Shabbat aliyot `1` through `7` plus `M` for maftir

#### Index Signature

 \[`key`: `string`\]: `string`[]

### haft

> **haft**: [`Aliyah`](Aliyah.md) \| [`Aliyah`](Aliyah.md)[]

Haftarah object(s)

### hebrew

> **hebrew**: `string`

parsha name in Hebrew with niqud

### num

> **num**: `number` \| `number`[]

1 for Bereshit, 2 for Noach, etc. `undefined` for holiday readings

### num1?

> `optional` **num1**: `number`

### num2?

> `optional` **num2**: `number`

### p1?

> `optional` **p1**: `string`

### p2?

> `optional` **p2**: `string`

### seph?

> `optional` **seph**: [`Aliyah`](Aliyah.md) \| [`Aliyah`](Aliyah.md)[]

Haftarah object(s) for Sephardim

### weekday?

> `optional` **weekday**: `object`

Map of weekday Torah Readings
 aliyot `1` through `3` for Monday and Thursday

#### Index Signature

 \[`key`: `string`\]: `string`[]

## Defined in

[types.ts:37](https://github.com/hebcal/hebcal-leyning/blob/40b5eb1606b3ea086311ad0bbcf740bb6031ecb8/src/types.ts#L37)
