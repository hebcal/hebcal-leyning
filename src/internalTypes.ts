import {AliyotSource, TanakhBook} from './types';

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
  chabad?: JsonFestivalAliyah | JsonFestivalAliyah[] | {sameas: 'haft'};
  fullkriyah?: JsonFestivalAliyotMap;
  alt?: Record<
    string,
    {sources?: AliyotSource[]; fullkriyah: JsonFestivalAliyotMap}
  >;
  megillah?: string;
  alias?: boolean;
  key?: string;
  note?: string;
  il?: boolean;
};
