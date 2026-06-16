/** English names of books of the Pentateuch */
export type TorahBook =
  | 'Genesis'
  | 'Exodus'
  | 'Leviticus'
  | 'Numbers'
  | 'Deuteronomy';

/** English names of books of the Prophets */
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

/** English names of books of the Writings */
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

export type TanakhBook = TorahBook | NeviimBook | KetuvimBook;

/**
 * Represents an aliyah
 */
export type Aliyah = {
  /** Book (e.g. "Numbers") */
  k: TanakhBook;
  /** beginning verse (e.g. "28:9") */
  b: string;
  /** ending verse (e.g. "28:15") */
  e: string;
  /** number of verses */
  v?: number;
  /** parsha number (1=Bereshit, 54=Vezot HaBracha) */
  p?: number;
  reason?: string;
};

export type StringMap = Record<string, string>;

export type AliyotMap = Record<string, Aliyah>;

/**
 * Identifier for an alternate aliyah-division tradition (minhag).
 *
 * Well-known values are `chabad` and `sephardic`, but the set is
 * open-ended so additional traditions can be added without a breaking
 * type change.
 */
export type AliyotTradition = 'chabad' | 'sephardic' | (string & {});

/**
 * An alternate division of the aliyot according to a particular
 * tradition (minhag) or source.
 *
 * For a weekly parsha, `fullkriyah` contains only the aliyot that
 * differ from the default division; for a holiday reading it contains
 * the complete alternate division.
 */
export type AltAliyot = {
  /**
   * Human-readable attribution for this division,
   *  e.g. `"Chabad, Torah Temimah, Tikkun Yissachar, Sefaria"`
   */
  source?: string;
  /** Map of aliyot `1` through `7` plus `M` for maftir */
  fullkriyah: AliyotMap;
};

/** Name of the parsha hashavua or holiday */
export type LeyningNames = {
  /** English */
  en: string;
  /** Hebrew (with nikud) */
  he: string;
};

/**
 * Parsha metadata (underlying JSON object)
 */
export type ParshaMeta = {
  /** 1 for Bereshit, 2 for Noach, etc. `undefined` for holiday readings */
  num: number | number[];
  /** parsha name in Hebrew with niqud */
  hebrew: string;
  /** 1 for Genesis, 2 for Exodus, 5 for Deuteronomy */
  book: number;
  /** Haftarah object(s) */
  haft: Aliyah | Aliyah[];
  /** Haftarah object(s) for Sephardim */
  seph?: Aliyah | Aliyah[];
  /** Haftarah object(s) for Chabad */
  chabad?: Aliyah | Aliyah[];
  /** Map of Shabbat aliyot `1` through `7` plus `M` for maftir */
  fullkriyah: Record<string, string[]>;
  /** Source attribution for the default `fullkriyah` division, e.g. `"Koren, Etz Hayyim, USCJ Luach"` */
  fullkriyahSrc?: string;
  /**
   * Alternate aliyah divisions keyed by tradition (minhag) identifier
   *  such as `chabad`. Each division lists only the aliyot that differ
   *  from the default `fullkriyah`.
   */
  alt?: Record<string, {source?: string; fullkriyah: Record<string, string[]>}>;
  /**
   * Map of weekday Torah Readings
   *  aliyot `1` through `3` for Monday and Thursday
   */
  weekday?: Record<string, string[]>;
  combined?: boolean;
  p1?: string;
  p2?: string;
  num1?: number;
  num2?: number;
};

export type SpecialReading = {
  /** Map of aliyot `1` through `7` plus `M` for maftir */
  aliyot: AliyotMap;
  /**
   * Explanations for special readings,
   *  keyed by aliyah number, `M` for maftir or `haftara` for Haftarah
   */
  reason: StringMap;
  /** Haftarah object(s) */
  haft?: Aliyah | Aliyah[];
  /** Haftarah object(s) for Sephardim */
  seph?: Aliyah | Aliyah[];
  /** Haftarah object(s) for Chabad */
  chabad?: Aliyah | Aliyah[];
};

/**
 * Leyning base - weekday, parsha hashavua or holiday
 */
export type LeyningBase = {
  /** Name of the parsha hashavua or holiday */
  name: LeyningNames;
  /** Such as `Genesis 1:1 - 6:8` */
  summary: string;
  type: 'shabbat' | 'holiday' | 'weekday';
  summaryParts?: Aliyah[];
  note?: string;
};

/**
 * Parashat haShavua - weekday or Shabbat
 */
export type LeyningParshaHaShavua = LeyningBase & {
  /** An array of either 1 (regular) or 2 (doubled parsha). `undefined` for holiday readings */
  parsha?: string[];
  /** 1 for Bereshit, 2 for Noach, etc. `undefined` for holiday readings */
  parshaNum?: number | number[];
};

/**
 * Parashat haShavua - weekday
 */
export type LeyningWeekday = LeyningParshaHaShavua & {
  /** Optional map of weekday Torah Readings aliyot `1` through `3` for Monday and Thursday */
  weekday?: AliyotMap;
};

export type HaftarahProps = {
  /** Haftarah object */
  haft: Aliyah | Aliyah[];
  /** Haftarah, such as `Isaiah 42:5 – 43:11` */
  haftara: string;
  /** Number of verses in the Haftarah */
  haftaraNumV?: number;
};

/**
 * Shabbat and holiday leyning always has full kriyah and haftarah
 */
export type LeyningShabbatHoliday = LeyningBase &
  HaftarahProps & {
    /** Map of aliyot `1` through `7` plus `M` for maftir */
    fullkriyah: AliyotMap;
    /** Source attribution for the default `fullkriyah` division, e.g. `"Koren, Etz Hayyim, USCJ Luach"` */
    fullkriyahSrc?: string;
    /**
     * Alternate aliyah divisions keyed by tradition (minhag) identifier.
     *
     * For example `alt.chabad` holds the Chabad division of a weekly
     * parsha and `alt.sephardic` holds the Sephardi division of a
     * holiday reading. For a weekly parsha each division's `fullkriyah`
     * lists only the aliyot that differ from the default; for a holiday
     * reading it lists the complete alternate division.
     */
    alt?: Record<string, AltAliyot>;
    /** Haftarah object for Sephardim */
    seph?: Aliyah | Aliyah[];
    /** Haftarah object(s) for Chabad */
    chabad?: Aliyah | Aliyah[];
    /** Haftarah for Sephardim, such as `Isaiah 42:5 - 42:21` */
    sephardic?: string;
    /** Number of verses in the Haftarah for Sephardim */
    sephardicNumV?: number;
    /** Explanations for special readings, keyed by aliyah number, `M` for maftir or `haftara` for Haftarah */
    reason?: StringMap;
    /** Song of Songs is read on the sabbath of Passover week, the Book of Ruth on Shavuot, Lamentations on Tisha be-Av, Ecclesiastes on the sabbath of the week of Sukkoth, and the Book of Esther on Purim */
    megillah?: AliyotMap;
    /** Triennial alternate Haftara */
    triHaftara?: string;
    /** Triennial alternate Haftara number of verses */
    triHaftaraNumV?: number;
  };

export type Leyning = LeyningBase &
  LeyningParshaHaShavua &
  LeyningShabbatHoliday &
  LeyningWeekday;
