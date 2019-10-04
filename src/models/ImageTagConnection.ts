import {
  IImageTagsConnection,
  IImageTagEdge,
  IImageTag,
  IPageInfo
} from 'services/auroraApiClients/imageRepositoryClient/query';

export class ImageTagsConnection {
  edges: IImageTagEdge[];
  totalCount: number;
  pageInfo: IPageInfo;

  constructor(data: IImageTagsConnection) {
    this.edges = data.edges;
    this.totalCount = data.totalCount;
    this.pageInfo = data.pageInfo;
  }

  public getTags(): IImageTag[] {
    return this.edges.map(edge => edge.node);
  }

  public hasNextPage(): boolean {
    return this.pageInfo.hasNextPage;
  }
}
