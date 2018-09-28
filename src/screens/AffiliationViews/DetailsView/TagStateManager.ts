import { findImageTagTypeName, ImageTagType } from 'models/ImageTagType';
import StateManager from 'models/StateManager';
import { ITag, ITagsPaged, ITagsPagedGroup } from 'models/Tag';

export class TagStateManager extends StateManager<ITagsPagedGroup> {
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
    const name = findImageTagTypeName(type);

    this.updateState(state => ({
      ...state,
      [name]: this.updateTags(state[name], next)
    }));
  }

  public getTagsPaged(type: ImageTagType): ITagsPaged {
    const name = findImageTagTypeName(type);
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

  private updateTags(old: ITagsPaged, next: ITagsPaged): ITagsPaged {
    return {
      ...next,
      tags: [...old.tags, ...next.tags]
    };
  }
}
