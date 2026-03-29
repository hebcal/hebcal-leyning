# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run build       # po2json + rollup bundle (ESM + IIFE)
npm run test        # run all tests with Vitest
npm run lint        # check style with gts (Google TypeScript Style)
npm run fix         # auto-fix lint issues
npm run coverage    # test coverage report
```

Run a single test file:
```bash
npx vitest run test/holiday.spec.js
```

Run tests matching a pattern:
```bash
npx vitest run --reporter=verbose -t "Chanukah"
```

## Architecture

This library provides Torah reading (leyning) data for weekly parshiyot, holidays, and weekday readings. It is a data + logic library — no UI, no HTTP.

### Core data files

- `src/aliyot.json` — the 54 weekly Torah portions (parshiyot), each with `fullkriyah` (7 aliyot + maftir `M`), `weekday` (Mon/Thu), and `haft` (haftarah)
- `src/holiday-readings.json` — ~50+ festival readings, same aliyah structure
- `src/numverses.json` — verse counts per chapter per book, used to calculate `v` (verse count) on `Aliyah` objects

### Key types (`src/types.ts`)

```typescript
Aliyah { k: TanakhBook, b: string, e: string, v?: number, p?: number, reason?: string }
AliyotMap = Record<string, Aliyah>   // keys: "1"–"7", "M"
LeyningShabbatHoliday { fullkriyah, haft, haftara, seph?, chabad?, ... }
Leyning  // merged complete reading object
```

### Data flow

```
Event / HDate
  └─> getLeyningKeyForEvent()       src/getLeyningKeyForEvent.ts
  └─> getLeyningOnDate()            src/getLeyningOnDate.ts
        ├─ getLeyningForParshaHaShavua()   src/leyning.ts      (Shabbat parsha)
        ├─ getLeyningForHoliday()          src/getLeyningForHoliday.ts
        └─ getWeekdayReading()             src/leyning.ts
              └─ specialReadings2()        src/specialReadings.ts
                    (overlays Chanukah, Rosh Chodesh, Shabbat HaGadol, etc.)
```

### Special readings overlay

`specialReadings2()` in `src/specialReadings.ts` modifies the base parsha reading when a holiday coincides with Shabbat (e.g., Shabbat Rosh Chodesh, Chanukah). It returns the modified `Leyning` object with alternate maftir/haftara and sets `reason` strings on affected aliyot.

### Traditions

Three haftarah traditions are supported: standard Ashkenazi (default), Sephardic (`seph`), and Chabad (`chabad`). The `chabad` tradition is implemented in `src/leyning.ts` via the `chabad` property on haftarah objects in `aliyot.json`.

### Translation / locale

PO files in `po/` are compiled to `src/he.po.ts` and `src/ashkenazi.po.ts` via `npm run po2json`. Locale registration happens in `src/locale.ts`. Supports `he` and `he-x-NoNikud` (no vowels).

### Build outputs

- `dist/esm/` — ES modules (one file per source file, preserves tree-shaking)
- `dist/bundle.js` / `dist/bundle.min.js` — IIFE bundles for browsers

## Testing

Tests are in `test/*.spec.js` (plain JS, not TS). The largest test files are `getLeyningForParshaHaShavua.spec.js` and `holiday.spec.js`. Tests import directly from `src/index.ts` via Vitest's TypeScript support.
