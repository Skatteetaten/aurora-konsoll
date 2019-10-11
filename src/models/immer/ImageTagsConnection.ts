import { immerable } from 'immer';
import { uniqBy } from 'lodash';

import {
  IImageTagsConnection,
  IImageTagEdge,
  IImageTag,
  IPageInfo
} from 'services/auroraApiClients/imageRepositoryClient/query';

export class ImageTagsConnection {
  [immerable] = true;

  private edges: IImageTagEdge[];
  private totalCount: number;
  private pageInfo: IPageInfo;

  constructor(data: IImageTagsConnection) {
    this.edges = data.edges;
    this.totalCount = data.totalCount;
    this.pageInfo = data.pageInfo;
  }

  public findVersionIndex(name: string): number {
    return this.getVersions().findIndex(version => version.name === name);
  }

  public totalVersionsCount(): number {
    return this.totalCount;
  }

  public currentVersionsSize(): number {
    return this.edges.length;
  }

  public getVersions(): IImageTag[] {
    return this.edges
      .map(edge => edge.node)
      .sort((t1, t2) => {
        const t1LastModified = (t1.image && t1.image.buildTime) || '';
        const t2LastModified = (t2.image && t2.image.buildTime) || '';

        if (t1LastModified === '' || t2LastModified === '') return 0;
        const date1 = new Date(t1LastModified).getTime();
        const date2 = new Date(t2LastModified).getTime();
        return date2 - date1;
      });
  }

  public getCursor(): string {
    return this.pageInfo.endCursor;
  }

  public hasNextPage(): boolean {
    return this.pageInfo.hasNextPage;
  }

  public addVersions(next: IImageTagEdge[]): void {
    const edges = [...this.edges, ...next];
    const nodes = edges.map(edge => edge.node);
    this.edges = uniqBy(nodes, 'name').map(node => ({ node }));
  }

  public setPageInfo(pageInfo: IPageInfo): void {
    this.pageInfo = pageInfo;
  }

  public setTotalCount(total: number): void {
    this.totalCount = total;
  }
}
