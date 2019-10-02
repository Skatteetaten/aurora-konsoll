import { uniqBy } from 'lodash';
import { findImageTagTypeName, ImageTagType } from 'models/ImageTagType';
import StateManager from 'models/StateManager';
import {
  ITag,
  ITagsPaged,
  ITagsPagedGroup,
  defaultTagsPaged
} from 'models/Tag';

export class TagStateManager extends StateManager<ITagsPagedGroup> {
  public setTagsPagedGroup(tagsPagedGroup: ITagsPagedGroup) {
    this.updateState(tagsPagedGroup);
  }

  public updateTagsPaged(
    type: ImageTagType,
    next?: ITagsPaged,
    newTags?: ITagsPaged
  ): void {
    const name = findImageTagTypeName(type);
    const updateTags = (state: ITagsPagedGroup) => {
      return this.addTags(state[name], next, newTags);
    };

    this.updateState(state => ({
      ...state,
      [name]: updateTags(state)
    }));
  }

  public clearTagsPaged(type: ImageTagType): void {
    const name = findImageTagTypeName(type);

    this.updateState(state => ({
      ...state,
      [name]: defaultTagsPaged
    }));
  }

  public getTagsPaged(type: ImageTagType): ITagsPaged {
    const name = findImageTagTypeName(type);
    return this.getState()[name];
  }

  public getTagsPageFiltered(type: ImageTagType): ITagsPaged {
    const sortTagsByDate = (t1: ITag, t2: ITag) => {
      if (t1.lastModified && t2.lastModified) {
        const date1 = new Date(t1.lastModified).getTime();
        const date2 = new Date(t2.lastModified).getTime();
        return date2 - date1;
      }
      return 0;
    };

    const tagsPaged = this.getTagsPaged(type);

    const tags = tagsPaged.tags.sort(sortTagsByDate).map(tag => ({
      ...tag,
      lastModified: tag.lastModified
        ? new Date(tag.lastModified).toISOString()
        : ''
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

  private addTags(
    old: ITagsPaged,
    next?: ITagsPaged,
    newTags?: ITagsPaged
  ): ITagsPaged {
    if (next) {
      return {
        ...next,
        tags: uniqBy([...old.tags, ...next.tags], 'name')
      };
    } else if (newTags) {
      return {
        ...old,
        tags: uniqBy([...newTags.tags, ...old.tags], 'name')
      };
    }
    return old;
  }
}
