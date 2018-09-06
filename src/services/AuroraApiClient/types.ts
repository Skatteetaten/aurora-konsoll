import { ImageTagType } from './imageRepository/query';
import { TagsPagedGroup } from './imageRepository/TagsPageGroup';
import { IPodResource } from './queries/applications-query';

export interface IAuroraApiClient {
  findUserAndAffiliations: () => Promise<IUserAndAffiliations>;
  findAllApplicationDeployments: (
    affiliations: string[]
  ) => Promise<IApplicationDeployment[]>;
  findGroupedTagsPaged: (repository: string) => Promise<TagsPagedGroup>;
  findTagsPaged: (
    repository: string,
    first?: number,
    cursor?: string,
    types?: ImageTagType[]
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
