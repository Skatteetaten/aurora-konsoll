import ApolloClient, { ObservableQuery } from 'apollo-boost';

import { tokenStore } from '../TokenStore';

import { QueryScheduler } from 'apollo-client/scheduler/scheduler';
import {
  APPLICATIONS_QUERY,
  IApplications,
  ITags,
  IUserAffiliationsQuery,
  TAGS_QUERY,
  USER_AFFILIATIONS_QUERY
} from './queries';

import {
  IApplication,
  IAuroraApiClient,
  IFetchMoreOptions,
  IUserAffiliationResult
} from './types';

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

  public async findTags(): Promise<{
    result: ITags;
    fetchMore: (cursor: string) => Promise<ITags>;
  }> {
    const query = new ObservableQuery<ITags>({
      options: {
        query: TAGS_QUERY,
        variables: {
          affiliations: ['aurora']
        }
      },
      scheduler: new QueryScheduler({
        queryManager: this.client.queryManager
      })
    });

    query.subscribe(x => x);
    const result = await query.result();

    const fetchMore = async (cursor: string) => {
      const newResult = await query.fetchMore({
        updateQuery: (
          previous: ITags,
          { fetchMoreResult }: IFetchMoreOptions
        ): ITags => {
          return {
            applications: fetchMoreResult
              ? fetchMoreResult.applications
              : previous.applications
          };
        },
        variables: {
          cursor
        }
      });

      return newResult.data;
    };

    return {
      fetchMore,
      result: result.data
    };
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
  ): Promise<IApplication[]> {
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
