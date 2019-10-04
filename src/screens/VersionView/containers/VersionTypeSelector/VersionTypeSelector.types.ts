import { ImageTagType } from 'models/ImageTagType';

export interface IImageTagTypeOption {
  key: ImageTagType;
  tag: ImageTagType;
  text: string;
}

export type TotalCountMap = Omit<Record<ImageTagType, number>, 'SEARCH'>;
