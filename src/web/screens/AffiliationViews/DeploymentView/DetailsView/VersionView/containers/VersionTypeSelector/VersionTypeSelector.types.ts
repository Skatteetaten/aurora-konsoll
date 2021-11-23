import { ImageTagType } from 'web/models/ImageTagType';

export type TotalCountMap = Omit<Record<ImageTagType, number>, 'SEARCH'>;
