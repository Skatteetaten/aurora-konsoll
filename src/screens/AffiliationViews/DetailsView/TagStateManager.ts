import {
  findImageTagTypeNameAndLabel,
  ImageTagType
} from 'models/ImageTagType';
import StateManager from 'models/StateManager';
import { ITag, ITagsPaged, ITagsPagedGroup } from 'models/Tag';

export class TagStateManager extends StateManager<ITagsPagedGroup> {
  public setTagsPagedGroup(tagsPagedGroup: ITagsPagedGroup) {
    this.updateState(tagsPagedGroup);
  }

  public updateTagsPaged(
    type: ImageTagType,
    next?: ITagsPaged,
    newTags?: ITag[]
  ): void {
    const name = findImageTagTypeNameAndLabel(type).name;

    const updateTags = (state: ITagsPagedGroup) => {
      if (next && next.tags.length > 0) {
        return this.addOldTags(state[name], next);
      } else if (newTags && newTags.length > 0) {
        return this.addNewTags(type, newTags);
      }
      return undefined;
    };

    this.updateState(state => ({
      ...state,
      [name]: updateTags(state)
    }));
  }

  public getTagsPaged(type: ImageTagType): ITagsPaged {
    const name = findImageTagTypeNameAndLabel(type).name;
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

  public containsTags(): boolean {
    const state = this.getState();
    const tagsCount = Object.keys(state).reduce((acc, k) => {
      return acc + (state[k] as ITagsPaged).tags.length;
    }, 0);

    return tagsCount > 0;
  }

  private addOldTags(old: ITagsPaged, next: ITagsPaged): ITagsPaged {
    return {
      ...next,
      tags: [...old.tags, ...next.tags]
    };
  }

  public addNewTags(type: ImageTagType, newTags: ITag[]): ITagsPaged {
    const currentTags = this.getTagsPaged(type);
    return {
      ...currentTags,
      tags: [...newTags, ...currentTags.tags]
    };
  }
}
