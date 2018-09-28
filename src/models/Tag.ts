import { ImageTagType } from 'models/ImageTagType';

export interface ITag {
  name: string;
  type: ImageTagType;
  lastModified: string;
}

export interface ITagsPaged {
  endCursor: string;
  hasNextPage: boolean;
  tags: ITag[];
}

export interface ITagsPagedGroup {
  major: ITagsPaged;
  minor: ITagsPaged;
  bugfix: ITagsPaged;
  latest: ITagsPaged;
  snapshot: ITagsPaged;
  auroraVersion: ITagsPaged;
}
