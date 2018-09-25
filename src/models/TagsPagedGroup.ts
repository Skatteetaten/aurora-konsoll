import { ITag, ITagsPaged } from 'services/auroraApiClients';

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

  constructor(tagsGrouped?: ITagsPagedGroup) {
    this.tagsPagedGroup = tagsGrouped || this.defaultTagsPaged();
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

  public getTagsForType(type: ImageTagType, searchText: string): ITag[] {
    const sortTagsByDate = (t1: ITag, t2: ITag) => {
      const date1 = new Date(t1.lastModified).getTime();
      const date2 = new Date(t2.lastModified).getTime();
      return date2 - date1;
    };

    return this.getTagsPaged(type)
      .tags.filter(v => {
        return searchText.length === 0 || v.name.search(searchText) !== -1;
      })
      .sort(sortTagsByDate)
      .map(tag => ({
        ...tag,
        lastModified: new Date(tag.lastModified).toISOString()
      }));
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

  private defaultTagsPaged() {
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
}
