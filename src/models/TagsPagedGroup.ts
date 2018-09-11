import { ITagsPaged } from 'services/auroraApiClients';

export enum ImageTagType {
  AURORA_VERSION = 'AURORA_VERSION',
  BUGFIX = 'BUGFIX',
  LATEST = 'LATEST',
  MAJOR = 'MAJOR',
  MINOR = 'MINOR',
  SNAPSHOT = 'SNAPSHOT'
}

export interface ITagsPagedGroup {
  major: ITagsPaged;
  minor: ITagsPaged;
  bugfix: ITagsPaged;
  latest: ITagsPaged;
  snapshot: ITagsPaged;
  auroraVersion: ITagsPaged;
}

export class TagsPagedGroup {
  private tagsPagedGroup: ITagsPagedGroup;

  constructor(tagsGrouped: ITagsPagedGroup) {
    this.tagsPagedGroup = tagsGrouped;
  }

  public updateTagsPaged(type: ImageTagType, next: ITagsPaged): TagsPagedGroup {
    const name = this.findName(type);
    const old = this.tagsPagedGroup[name];

    const updatedTagsPagedGroup = {
      ...this.tagsPagedGroup,
      [name]: this.updateTags(old, next)
    };

    return new TagsPagedGroup(updatedTagsPagedGroup);
  }

  public getTagsPaged(type: ImageTagType): ITagsPaged {
    const name = this.findName(type);
    return this.tagsPagedGroup[name];
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
