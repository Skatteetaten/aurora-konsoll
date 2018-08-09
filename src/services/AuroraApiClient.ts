import { default as ApolloClient } from 'apollo-boost';

import { tokenStore } from './TokenStore';

import {
  APPLICATIONS_QUERY,
  IApplications,
  IPodResource,
  IUserAffiliationsQuery,
  USER_AFFILIATIONS_QUERY
} from './auroraApiClient/queries';

export interface IAuroraApiClient {
  findUserAndAffiliations: () => Promise<IUserAffiliationResult>;
  findAllApplicationsForAffiliations: (
    affiliations: string[]
  ) => Promise<IApplicationResult[]>;
}

export default class AuroraApiClient implements IAuroraApiClient {
  private client: ApolloClient<{}>;

  constructor(graphQLUrl: string) {
    const client = new ApolloClient({
      request: async operations => {
        const token = tokenStore.getToken();
        operations.setContext({
          headers: {
            Authorization: token ? `Bearer ${token}` : ''
          }
        });
      },
      uri: graphQLUrl
    });
    client.defaultOptions = {
      query: {
        fetchPolicy: 'network-only'
      }
    };

    this.client = client;
  }

  public async findUserAndAffiliations(): Promise<IUserAffiliationResult> {
    const result = await this.client.query<IUserAffiliationsQuery>({
      query: USER_AFFILIATIONS_QUERY
    });

    return {
      affiliations: result.data.affiliations.edges.map(edge => edge.node.name),
      user: result.data.currentUser.name
    };
  }

  public async findAllApplicationsForAffiliations(
    affiliations: string[]
  ): Promise<IApplicationResult[]> {
    const result = await this.client.query<IApplications>({
      query: APPLICATIONS_QUERY,
      variables: {
        affiliations
      }
    });

    return result.data.applications.edges.reduce((acc, { node }) => {
      const { applicationInstances } = node;
      const apps = applicationInstances.map(app => ({
        affiliation: app.affiliation.name,
        environment: app.environment,
        name: node.name,
        pods: app.details.podResources,
        statusCode: app.status.code,
        version: {
          auroraVersion: app.version.auroraVersion,
          deployTag: app.version.deployTag
        }
      }));
      return [...acc, ...apps];
    }, []);
  }
}

export interface IUserAffiliationResult {
  affiliations: string[];
  user: string;
}

export interface IApplicationResult {
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
