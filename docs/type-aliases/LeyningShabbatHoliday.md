[**@hebcal/leyning**](../README.md) • **Docs**

***

[@hebcal/leyning](../globals.md) / LeyningShabbatHoliday

# Type Alias: LeyningShabbatHoliday

> **LeyningShabbatHoliday**: [`LeyningBase`](LeyningBase.md) & `object`

Shabbat and holiday leyning always has full kriyah and haftarah

## Type declaration

### fullkriyah

> **fullkriyah**: [`AliyotMap`](AliyotMap.md)

Map of aliyot `1` through `7` plus `M` for maftir

### haft

> **haft**: [`Aliyah`](Aliyah.md) \| [`Aliyah`](Aliyah.md)[]

Haftarah object

### haftara

> **haftara**: `string`

Haftarah, such as `Isaiah 42:5 – 43:11`

### haftaraNumV?

> `optional` **haftaraNumV**: `number`

Number of verses in the Haftarah

### megillah?

> `optional` **megillah**: [`AliyotMap`](AliyotMap.md)

Song of Songs is read on the sabbath of Passover week, the Book of Ruth on Shavuot, Lamentations on Tisha be-Av, Ecclesiastes on the sabbath of the week of Sukkoth, and the Book of Esther on Purim

### reason?

> `optional` **reason**: [`StringMap`](StringMap.md)

Explanations for special readings, keyed by aliyah number, `M` for maftir or `haftara` for Haftarah

### seph?

> `optional` **seph**: [`Aliyah`](Aliyah.md) \| [`Aliyah`](Aliyah.md)[]

Haftarah object for Sephardim

### sephardic?

> `optional` **sephardic**: `string`

Haftarah for Sephardim, such as `Isaiah 42:5 - 42:21`

### sephardicNumV?

> `optional` **sephardicNumV**: `number`

Number of verses in the Haftarah for Sephardim

### triHaftara?

> `optional` **triHaftara**: `string`

Triennial alternate Haftara

### triHaftaraNumV?

> `optional` **triHaftaraNumV**: `number`

Triennial alternate Haftara number of verses

## Defined in

[types.ts:114](https://github.com/hebcal/hebcal-leyning/blob/40b5eb1606b3ea086311ad0bbcf740bb6031ecb8/src/types.ts#L114)
