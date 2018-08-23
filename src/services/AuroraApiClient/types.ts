import { IPodResource } from './queries/applications-query';
import { IPageInfo } from './queries/tag-query';

export interface IAuroraApiClient {
  findUserAndAffiliations: () => Promise<IUserAndAffiliations>;
  findAllApplicationsForAffiliations: (
    affiliations: string[]
  ) => Promise<IApplicationInstance[]>;
  findTagsPaged: (repository: string, cursor?: string) => Promise<ITagsPaged>;
}

export interface IUserAndAffiliations {
  affiliations: string[];
  user: string;
}

export interface IApplicationInstance {
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