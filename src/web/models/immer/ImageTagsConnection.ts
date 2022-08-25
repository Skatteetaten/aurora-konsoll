import { immerable } from 'immer';
import _ from 'lodash';

import {
  IVersion,
  IVersionsConnection,
} from 'web/services/auroraApiClients/imageRepositoryClient/query';
import { ImageTagType } from '../ImageTagType';
import { TotalCountMap } from '../VersionTypeSelector.types';
import { versionSort } from '../../utils/sortFunctions';

interface IImageTagsByType {
  [type: string]: IVersion[];
}

export class ImageTagsConnection {
  [immerable] = true;

  private readonly versions: IVersion[];
  private readonly groupedByType: IImageTagsByType;

  constructor(data: IVersionsConnection) {
    this.versions = data;
    this.groupedByType = _.groupBy(this.getVersions(), (node) => node.type);
  }

  public findVersionIndex(name: string): number {
    return this.getVersions().findIndex((version) => version.name === name);
  }

  public getVersions(): IVersion[] {
    return this.versions;
  }

  public getVersionsOfType(type: ImageTagType): IVersion[] {
    const group = this.groupedByType[type.toString()];
    if (group && group.length > 0) return [...group].sort(versionSort(type));
    else return [];
  }

  public search(text: String): IVersion[] {
    const texts = text.split(' ').map((t) => t.trim().toLowerCase());
    return this.getVersions()
      .filter((imageTag) =>
        texts.every((t) => imageTag.name.toLowerCase().includes(t))
      )
      .sort(versionSort(ImageTagType.SEARCH, texts));
  }

  public getCountMap(): TotalCountMap {
    return Object.keys(ImageTagType).reduce(
      (map, type) => ({
        ...map,
        [type]: this.getVersionsOfType(ImageTagType[type]).length,
      }),
      {}
    );
  }
}
