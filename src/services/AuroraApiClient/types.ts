import { IPodResource } from './queries/applications-query';
import { ITagsGrouped } from './tags';

export interface IAuroraApiClient {
  findUserAndAffiliations: () => Promise<IUserAndAffiliations>;
  findAllApplicationDeployments: (
    affiliations: string[]
  ) => Promise<IApplicationDeployment[]>;
  findGroupedTagsPaged: (repository: string) => Promise<ITagsGrouped>;
  findTagsPaged: (
    repository: string,
    first?: number,
    cursor?: string,
    types?: string[]
  ) => Promise<ITagsPaged>;
}

export interface IPageInfo {
  endCursor: string;
  hasNextPage: boolean;
}

export interface IUserAndAffiliations {
  affiliations: string[];
  user: string;
}

export interface IApplicationDeployment {
  id: string;
  affiliation: string;
  name: string;
  environment: string;
  statusCode: string;
  version: {
    auroraVersion: string;
    deployTag: string;
  };
  repository: string;
  pods: IPodResource[];
}

export interface ITag {
  name: string;
  lastModified: string;
}

export interface ITagsPaged extends IPageInfo {
  tags: ITag[];
}
