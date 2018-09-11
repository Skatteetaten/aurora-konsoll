export * from './applicationDeploymentClient/client';
export * from './imageRepositoryClient/client';
export * from 'models/TagsPagedGroup';

export interface IPageInfo {
  endCursor: string;
  hasNextPage: boolean;
}
