import ApolloClient from 'apollo-boost';

import { tokenStore } from '../TokenStore';

import {
  IUserAffiliationsQuery,
  USER_AFFILIATIONS_QUERY
} from './queries/user-affiliations-query';

import {
  APPLICATIONS_QUERY,
  IApplications
} from './queries/applications-query';

import {
  IApplicationDeployment,
  IAuroraApiClient,
  IUserAndAffiliations
} from './types';

import { ImageTagType } from './imageRepository/query';
import {
  findGroupedTagsPaged,
  findTagsPaged
} from './imageRepository/resolver';
import { TagsPagedGroup } from './imageRepository/TagsPageGroup';

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

  public async findTagsPaged(
    repository: string,
    first: number,
    cursor?: string,
    types?: ImageTagType[]
  ) {
    return findTagsPaged(this.client, repository, first, cursor, types);
  }

  public async findGroupedTagsPaged(
    repository: string
  ): Promise<TagsPagedGroup> {
    return findGroupedTagsPaged(this.client, repository);
  }

  public async findUserAndAffiliations(): Promise<IUserAndAffiliations> {
    const result = await this.client.query<IUserAffiliationsQuery>({
      query: USER_AFFILIATIONS_QUERY
    });

    return {
      affiliations: result.data.affiliations.edges.map(edge => edge.node.name),
      user: result.data.currentUser.name
    };
  }

  public async findAllApplicationDeployments(
    affiliations: string[]
  ): Promise<IApplicationDeployment[]> {
    const result = await this.client.query<IApplications>({
      query: APPLICATIONS_QUERY,
      variables: {
        affiliations
      }
    });

    return result.data.applications.edges.reduce((acc, { node }) => {
      const { applicationInstances, imageRepository } = node;
      const apps = applicationInstances.map(app => ({
        affiliation: app.affiliation.name,
        environment: app.environment,
        id: app.environment + '-' + node.name,
        name: node.name,
        pods: app.details.podResources,
        repository: imageRepository ? imageRepository.repository : '',
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
