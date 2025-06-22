import {TanakhBook} from './types';

export type JsonFestivalAliyah = {
  k: number | TanakhBook;
  b: string;
  e: string;
  v?: number;
  p?: number;
};

export type JsonFestivalAliyotMap = Record<string, JsonFestivalAliyah>;

export type JsonFestivalLeyning = {
  haft?: JsonFestivalAliyah | JsonFestivalAliyah[];
  seph?: JsonFestivalAliyah | JsonFestivalAliyah[];
  fullkriyah?: JsonFestivalAliyotMap;
  alt?: JsonFestivalAliyotMap;
  megillah?: string;
  alias?: boolean;
  key?: string;
  note?: string;
  il?: boolean;
};
