import { ImageTagType } from 'models/ImageTagType';

export type TotalCountMap = Omit<Record<ImageTagType, number>, 'SEARCH'>;
