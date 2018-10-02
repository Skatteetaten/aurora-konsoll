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

export function defaultTagsPagedGroup(): ITagsPagedGroup {
  const defaultTagsPaged: ITagsPaged = {
    endCursor: '',
    hasNextPage: false,
    tags: []
  };

  return {
    auroraVersion: defaultTagsPaged,
    bugfix: defaultTagsPaged,
    latest: defaultTagsPaged,
    major: defaultTagsPaged,
    minor: defaultTagsPaged,
    snapshot: defaultTagsPaged
  };
}
