import { ITagsPaged } from '../types';
import { ImageTagType } from './query';

export interface ITagsPagedGroup {
  major: ITagsPaged;
  minor: ITagsPaged;
  bugfix: ITagsPaged;
  latest: ITagsPaged;
  snapshot: ITagsPaged;
  auroraVersion: ITagsPaged;
}

export class TagsPagedGroup {
  private tagsGrouped: ITagsPagedGroup;

  constructor(tagsGrouped: ITagsPagedGroup) {
    this.tagsGrouped = tagsGrouped;
  }

  public updateTagsPaged(
    type: ImageTagType,
    update: ITagsPaged
  ): TagsPagedGroup {
    const name = this.findName(type);
    const old = this.tagsGrouped[name];

    const next = {
      ...this.tagsGrouped,
      [name]: this.updateTags(old, update)
    };

    return new TagsPagedGroup(next);
  }

  public getTagsPaged(type: ImageTagType): ITagsPaged {
    const name = this.findName(type);
    return this.tagsGrouped[name];
  }

  private findName(type: ImageTagType): string {
    switch (type) {
      case ImageTagType.AURORA_VERSION:
        return 'auroraVersion';
      case ImageTagType.BUGFIX:
        return 'bugfix';
      case ImageTagType.LATEST:
        return 'latest';
      case ImageTagType.MAJOR:
        return 'major';
      case ImageTagType.MINOR:
        return 'minor';
      case ImageTagType.SNAPSHOT:
        return 'snapshot';
    }
  }

  private updateTags(old: ITagsPaged, next: ITagsPaged): ITagsPaged {
    return {
      ...next,
      tags: [...old.tags, ...next.tags]
    };
  }
}
