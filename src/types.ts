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
  /** Theme of the Haftarah (Admonition or Consolation), if applicable */
  haftTheme?: HaftTheme;
  /** Map of Shabbat aliyot `1` through `7` plus `M` for maftir */
  fullkriyah: Record<string, string[]>;
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

/**
 * Identifies a Haftarah tied to the weeks around Tish'a B'Av
 */
export type HaftTheme = {
  /**
   * For the three Haftarot of Admonition (תְּלָתָא דְּפוּרְעָנוּתָא) read on the
   * three Shabbatot before Tish'a B'Av, `1`, `2` or `3`
   */
  admonition?: number;
  /**
   * For the seven Haftarot of Consolation (שֶׁבַע דְּנֶחָמְתָא) read on the seven
   * Shabbatot after Tish'a B'Av, `1` through `7`. In the rare year when
   * Parashat Re'eh coincides with Rosh Chodesh, the 3rd Haftarah of
   * Consolation is displaced and later chanted together with the 5th on
   * Parashat Ki Teitzei, in which case the value is the string `"3,5"`.
   */
  consolation?: number | string;
};

export type HaftarahProps = HaftTheme & {
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
    /** Alternate full kriyah */
    alt?: AliyotMap;
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
