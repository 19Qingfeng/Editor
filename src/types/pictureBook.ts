export interface BaseInfo {
  name: string;
  author: string;
  tag: number[];
  age: number;
  category: number;
  preview: string;
  guidance: string;
}

export interface PictureBook {
  baseInfo: BaseInfo;
  cover: string;
  zip: string;
}
