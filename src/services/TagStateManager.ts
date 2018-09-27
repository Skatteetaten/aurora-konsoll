import { ComponentStateHandler } from 'models/ComponentStateHandler';
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

export class TagStateManager extends ComponentStateHandler<ITagsPagedGroup> {
  public static defaultTagsPagedGroup(): ITagsPagedGroup {
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

  public setTagsPagedGroup(tagsPagedGroup: ITagsPagedGroup) {
    this.updateState(tagsPagedGroup);
  }

  public updateTagsPaged(type: ImageTagType, next: ITagsPaged) {
    const state = this.getState();
    const name = this.findName(type);
    const old = state[name];

    const updatedTagsPagedGroup = {
      ...state,
      [name]: this.updateTags(old, next)
    };

    this.updateState(updatedTagsPagedGroup);
  }

  public getTagsPaged(type: ImageTagType): ITagsPaged {
    const name = this.findName(type);
    return this.getState()[name];
  }

  public getTagsPageFiltered(
    type: ImageTagType,
    searchText: string
  ): ITagsPaged {
    const sortTagsByDate = (t1: ITag, t2: ITag) => {
      const date1 = new Date(t1.lastModified).getTime();
      const date2 = new Date(t2.lastModified).getTime();
      return date2 - date1;
    };

    const tagsPaged = this.getTagsPaged(type);

    const tags = tagsPaged.tags
      .filter(v => {
        return searchText.length === 0 || v.name.search(searchText) !== -1;
      })
      .sort(sortTagsByDate)
      .map(tag => ({
        ...tag,
        lastModified: new Date(tag.lastModified).toISOString()
      }));

    return {
      ...tagsPaged,
      tags
    };
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
