export type JsonFestivalAliyah = {
  k: number | string;
  b: string;
  e: string;
  v?: number;
  p?: number;
};

export type JsonFestivalAliyotMap = {
  [key: string]: JsonFestivalAliyah;
}

export type JsonFestivalLeyning = {
  haft?: JsonFestivalAliyah | JsonFestivalAliyah[];
  seph?: JsonFestivalAliyah | JsonFestivalAliyah[];
  fullkriyah?: JsonFestivalAliyotMap;
  megillah?: string;
  alias?: boolean;
  key?: string;
  note?: string;
  il?: boolean;
};
