import { IPodResource, ITags } from './queries';

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
  pods: IPodResource[];
}

export interface IAuroraApiClient {
  findUserAndAffiliations: () => Promise<IUserAffiliationResult>;
  findAllApplicationsForAffiliations: (
    affiliations: string[]
  ) => Promise<IApplication[]>;
  findTags: () => Promise<{
    result?: ITags;
    fetchMore: (cursor: string) => Promise<ITags | undefined>;
  }>;
}

export interface IFetchMoreOptions {
  fetchMoreResult?: ITags;
  variables: {
    [key: string]: any;
  };
}
