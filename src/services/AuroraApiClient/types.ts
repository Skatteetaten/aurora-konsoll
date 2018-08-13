import { IPodResource } from './queries/applications-query';

export interface IAuroraApiClient {
  findUserAndAffiliations: () => Promise<IUserAffiliationResult>;
  findAllApplicationsForAffiliations: (
    affiliations: string[]
  ) => Promise<IApplication[]>;
  findTagsPaged: (repository: string, cursor?: string) => Promise<ITagsPaged>;
}

export interface IUserAffiliationResult {
  affiliations: string[];
  user: string;
}

export interface IApplication {
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

export interface ITagsPaged {
  endCursor: string;
  hasNextPage: boolean;
  tags: ITag[];
}
