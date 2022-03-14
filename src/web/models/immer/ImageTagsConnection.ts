import { immerable } from 'immer';
import _ from 'lodash';

import {
  IImageTag,
  IImageTagEdge,
  IImageTagsConnection,
} from 'web/services/auroraApiClients/imageRepositoryClient/query';
import { ImageTagType } from '../ImageTagType';
import { TotalCountMap } from '../../screens/AffiliationViews/DeploymentView/DetailsView/VersionView/containers/VersionTypeSelector/VersionTypeSelector.types';

interface IImageTagsByType {
  [type: string]: IImageTag[];
}

export class ImageTagsConnection {
  [immerable] = true;

  private edges: IImageTagEdge[];
  private totalCount: number;
  private groupedByType: IImageTagsByType;

  constructor(data: IImageTagsConnection) {
    this.edges = data.edges;
    this.totalCount = data.totalCount;
    this.groupedByType = _.groupBy(this.getVersions(), (node) => node.type);
  }

  public findVersionIndex(name: string): number {
    return this.getVersions().findIndex((version) => version.name === name);
  }

  public totalVersionsCount(): number {
    return this.totalCount;
  }

  public currentVersionsSize(): number {
    return this.edges.length;
  }

  public getVersions(): IImageTag[] {
    return this.sortImageTagsByDate(this.edges.map((edge) => edge.node));
  }

  public getVersionsOfType(type: ImageTagType): IImageTag[] {
    const group = this.groupedByType[type.toString()];
    if (group && group.length > 0) return group;
    else return [];
  }

  public search(text: String): IImageTag[] {
    const texts = text.split(' ').map((t) => t.trim().toLowerCase());
    return this.getVersions().filter((imageTag) =>
      texts.every((t) => imageTag.name.toLowerCase().includes(t))
    );
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

  public setTotalCount(total: number): void {
    this.totalCount = total;
  }

  private sortImageTagsByDate(imageTags: IImageTag[]): IImageTag[] {
    return imageTags.sort((t1, t2) => {
      const t1LastModified = (t1.image && t1.image.buildTime) || 0;
      const t2LastModified = (t2.image && t2.image.buildTime) || 0;
      const date1 = new Date(t1LastModified).getTime();
      const date2 = new Date(t2LastModified).getTime();
      return date2 - date1;
    });
  }
}
