/** English names of the five books of the Pentateuch (Torah) */
export type TorahBook =
  | 'Genesis'
  | 'Exodus'
  | 'Leviticus'
  | 'Numbers'
  | 'Deuteronomy';

/** English names of the books of the Prophets (Nevi'im) */
export type NeviimBook =
  | 'Joshua'
  | 'Judges'
  | 'I Samuel'
  | 'II Samuel'
  | 'I Kings'
  | 'II Kings'
  | 'Isaiah'
  | 'Jeremiah'
  | 'Ezekiel'
  | 'Hosea'
  | 'Joel'
  | 'Amos'
  | 'Obadiah'
  | 'Jonah'
  | 'Micah'
  | 'Nachum' // spelled Nahum at Sefaria
  | 'Habakkuk'
  | 'Zephaniah'
  | 'Haggai'
  | 'Zechariah'
  | 'Malachi';

/** English names of the books of the Writings (Ketuvim) */
export type KetuvimBook =
  | 'Psalms'
  | 'Proverbs'
  | 'Job'
  | 'Song of Songs'
  | 'Ruth'
  | 'Lamentations'
  | 'Ecclesiastes'
  | 'Esther'
  | 'Daniel'
  | 'Ezra'
  | 'Nehemiah'
  | 'I Chronicles'
  | 'II Chronicles';

/**
 * English name of any of the 39 books of the Hebrew Bible (Tanakh),
 * spanning the Torah, Nevi'im (Prophets) and Ketuvim (Writings)
 */
export type TanakhBook = TorahBook | NeviimBook | KetuvimBook;

/**
 * A contiguous passage from a single book of the Tanakh.
 *
 * Used to represent a single aliyah of the Torah reading, a maftir, or all
 * or part of a Haftarah. A multi-part Haftarah is represented as an array of
 * `Aliyah` objects (see {@link HaftarahProps.haft}).
 */
export type Aliyah = {
  /** Book, e.g. `"Numbers"` */
  k: TanakhBook;
  /** Beginning `chapter:verse`, e.g. `"28:9"` */
  b: string;
  /** Ending `chapter:verse`, e.g. `"28:15"` */
  e: string;
  /** Number of verses in this passage, when calculated */
  v?: number;
  /** Parsha number (`1`=Bereshit … `54`=Vezot HaBracha), set on holiday/festival aliyot */
  p?: number;
  /**
   * When this passage differs from the regular reading because of a special
   * occasion, a human-readable explanation of why, such as
   * `"Shabbat Rosh Chodesh"` (translated to the requested language)
   */
  reason?: string;
};

/** Generic map of string keys to string values */
export type StringMap = Record<string, string>;

/**
 * Map of Torah reading aliyot keyed by `"1"` through `"7"` for the seven
 * aliyot, plus `"M"` for the maftir
 */
export type AliyotMap = Record<string, Aliyah>;

/** Transliterated English and Hebrew names of a parsha hashavua or holiday */
export type LeyningNames = {
  /** Transliterated English, e.g. `"Bereshit"` */
  en: string;
  /** Hebrew with nikud (vowel points), e.g. `"בְּרֵאשִׁית"` */
  he: string;
};

/**
 * Raw metadata for a single parsha, as stored in `aliyot.json` and returned
 * by {@link lookupParsha}.
 *
 * Note the raw JSON shapes differ from the richer types used in a computed
 * {@link Leyning}: here `fullkriyah`/`weekday` map to `[begin, end]` (or
 * `[begin, end, reason]`) string tuples rather than {@link Aliyah} objects,
 * and the book is given once as a number in {@link ParshaMeta.book} rather
 * than repeated on every passage.
 */
export type ParshaMeta = {
  /**
   * Parsha number: `1` for Bereshit, `2` for Noach, etc. For a doubled parsha
   * this is a two-element array such as `[21, 22]` (Vayakhel-Pekudei)
   */
  num: number | number[];
  /** Parsha name in Hebrew with nikud (vowel points) */
  hebrew: string;
  /** Book number: `1` for Genesis, `2` for Exodus … `5` for Deuteronomy */
  book: number;
  /** Haftarah, as a single passage or an array of passages */
  haft: Aliyah | Aliyah[];
  /** Alternate Haftarah read by Sephardim, if different from `haft` */
  seph?: Aliyah | Aliyah[];
  /** Alternate Haftarah read by Chabad, if different from `haft` */
  chabad?: Aliyah | Aliyah[];
  /**
   * Theme of the Haftarah when this parsha's Haftarah is one of the
   * Haftarot of Admonition or Consolation around Tish'a B'Av. See
   * {@link HaftTheme}.
   */
  haftTheme?: HaftTheme;
  /**
   * Shabbat Torah reading as `[begin, end]` (or `[begin, end, reason]`)
   * verse tuples, keyed by `"1"` through `"7"` plus `"M"` for the maftir
   */
  fullkriyah: Record<string, string[]>;
  /**
   * Weekday (Monday & Thursday) Torah reading as `[begin, end]` verse
   * tuples, keyed by `"1"` through `"3"`. Absent for parshiyot never read
   * on a weekday.
   */
  weekday?: Record<string, string[]>;
  /** `true` when this entry represents a doubled (combined) parsha */
  combined?: boolean;
  /** For a combined parsha, the name of the first component, e.g. `"Vayakhel"` */
  p1?: string;
  /** For a combined parsha, the name of the second component, e.g. `"Pekudei"` */
  p2?: string;
  /** For a combined parsha, the parsha number of the first component */
  num1?: number;
  /** For a combined parsha, the parsha number of the second component */
  num2?: number;
};

/**
 * Result of {@link specialReadings2}: the overrides that apply when the
 * weekly parsha coincides with a special occasion (Shabbat Rosh Chodesh,
 * Shabbat Chanukah, one of the four special Shabbatot, etc.).
 */
export type SpecialReading = {
  /**
   * The Torah reading with any special maftir or 7th aliyah already merged
   * in, keyed by `"1"` through `"7"` plus `"M"` for the maftir
   */
  aliyot: AliyotMap;
  /**
   * Explanations for the overrides, keyed by aliyah number (`"1"`–`"7"`),
   * `"M"` for the maftir, or `"haftara"`/`"sephardic"`/`"chabad"` for the
   * corresponding Haftarah. The value is an untranslated reason key.
   */
  reason: StringMap;
  /** Overriding Haftarah, if the special occasion replaces the regular one */
  haft?: Aliyah | Aliyah[];
  /** Overriding Haftarah for Sephardim, if applicable */
  seph?: Aliyah | Aliyah[];
  /** Overriding Haftarah for Chabad, if applicable */
  chabad?: Aliyah | Aliyah[];
};

/**
 * Fields common to every leyning result, whether for a weekday, a parashat
 * hashavua, or a holiday.
 */
export type LeyningBase = {
  /** Transliterated English and Hebrew name of the parsha or holiday */
  name: LeyningNames;
  /** One-line summary of the Torah reading, such as `"Genesis 1:1-6:8"` */
  summary: string;
  /** Whether this reading is for a Shabbat, a holiday, or a weekday */
  type: 'shabbat' | 'holiday' | 'weekday';
  /**
   * When the reading spans more than one book or non-contiguous section,
   * the parts that make up {@link LeyningBase.summary}
   */
  summaryParts?: Aliyah[];
  /** Free-form explanatory note about this reading, if any */
  note?: string;
};

/**
 * A parashat hashavua reading (weekday or Shabbat), adding the parsha
 * identity to {@link LeyningBase}.
 */
export type LeyningParshaHaShavua = LeyningBase & {
  /**
   * Parsha name(s): a one-element array for a regular parsha (`["Pinchas"]`)
   * or a two-element array for a doubled parsha (`["Matot", "Masei"]`).
   * `undefined` for holiday readings.
   */
  parsha?: string[];
  /**
   * Parsha number (`1`=Bereshit … `54`=Vezot HaBracha), or a two-element
   * array for a doubled parsha. `undefined` for holiday readings.
   */
  parshaNum?: number | number[];
};

/**
 * A weekday (Monday & Thursday) parashat hashavua reading.
 */
export type LeyningWeekday = LeyningParshaHaShavua & {
  /**
   * Weekday Torah reading, keyed by `"1"` through `"3"`. Present on weekday
   * readings and also attached to a Shabbat reading by {@link getLeyningForParsha}.
   */
  weekday?: AliyotMap;
};

/**
 * Identifies a Haftarah tied to the weeks around Tish'a B'Av: one of the
 * three Haftarot of Admonition (the "Three Weeks" before Tish'a B'Av) or the
 * seven Haftarot of Consolation (the seven Shabbatot after it). At most one
 * of the two fields is set.
 */
export type HaftTheme = {
  /**
   * For the three Haftarot of Admonition (תְּלָתָא דְּפוּרְעָנוּתָא) read on the
   * three Shabbatot before Tish'a B'Av: `1`, `2` or `3`.
   */
  admonition?: number;
  /**
   * For the seven Haftarot of Consolation (שֶׁבַע דְּנֶחָמְתָא) read on the seven
   * Shabbatot after Tish'a B'Av: `1` through `7`. In the rare year when
   * Parashat Re'eh coincides with Rosh Chodesh, the 3rd Haftarah of
   * Consolation is displaced and later chanted together with the 5th on
   * Parashat Ki Teitzei, in which case the value is the string `"3,5"`.
   */
  consolation?: number | string;
};

/**
 * The Haftarah portion of a leyning result, including its formatted summary
 * and any Tish'a B'Av theme (via {@link HaftTheme}).
 */
export type HaftarahProps = HaftTheme & {
  /** Haftarah, as a single passage or an array of passages */
  haft: Aliyah | Aliyah[];
  /** Formatted Haftarah citation, such as `"Isaiah 42:5 - 43:11"` */
  haftara: string;
  /** Total number of verses in the Haftarah */
  haftaraNumV?: number;
};

/**
 * A complete Shabbat or holiday leyning, which always has a full kriyah
 * (seven aliyot plus maftir) and a Haftarah.
 */
export type LeyningShabbatHoliday = LeyningBase &
  HaftarahProps & {
    /**
     * Torah reading keyed by `"1"` through `"7"` plus `"M"` for the maftir
     */
    fullkriyah: AliyotMap;
    /** Alternate full kriyah, when a second valid custom exists */
    alt?: AliyotMap;
    /** Haftarah for Sephardim, when different from the Ashkenazi `haft` */
    seph?: Aliyah | Aliyah[];
    /** Haftarah for Chabad, when different from the Ashkenazi `haft` */
    chabad?: Aliyah | Aliyah[];
    /** Formatted Sephardic Haftarah citation, such as `"Isaiah 42:5 - 42:21"` */
    sephardic?: string;
    /** Total number of verses in the Sephardic Haftarah */
    sephardicNumV?: number;
    /**
     * Explanations for special readings, keyed by aliyah number (`"1"`–`"7"`),
     * `"M"` for the maftir, or `"haftara"` for the Haftarah. Values are
     * translated to the requested language.
     */
    reason?: StringMap;
    /**
     * The Five Scrolls (megillot) read on certain holidays: Song of Songs on
     * the Shabbat of Passover week, Ruth on Shavuot, Lamentations on Tish'a
     * B'Av, Ecclesiastes on the Shabbat of Sukkot, and Esther on Purim.
     */
    megillah?: AliyotMap;
    /** Alternate Haftarah for the triennial reading cycle, if different */
    triHaftara?: string;
    /** Number of verses in the triennial alternate Haftarah */
    triHaftaraNumV?: number;
  };

/**
 * A fully-computed leyning. This is the union of every leyning shape —
 * weekday, parashat hashavua, and Shabbat/holiday — so any field that can
 * appear on a reading is present here as optional. Inspect
 * {@link LeyningBase.type} to know which fields to expect.
 */
export type Leyning = LeyningBase &
  LeyningParshaHaShavua &
  LeyningShabbatHoliday &
  LeyningWeekday;
