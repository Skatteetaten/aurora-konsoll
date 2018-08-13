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
import { ITagsQuery, TAGS_QUERY } from './queries/tag-query';
import { IApplication, ITagsPaged, IUserAffiliationResult } from './types';
import { IAuroraApiClient } from './types';

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
    cursor?: string
  ): Promise<ITagsPaged> {
    const result = await this.client.query<ITagsQuery>({
      query: TAGS_QUERY,
      variables: {
        cursor,
        repositories: [repository]
      }
    });

    const { imageRepositories } = result.data;

    if (!(imageRepositories && imageRepositories.length > 0)) {
      throw new Error(`Could not find tags for repository ${repository}`);
    }

    const [mainRepo] = imageRepositories;
    const { edges, pageInfo } = mainRepo.tags;

    return {
      endCursor: pageInfo.endCursor,
      hasNextPage: pageInfo.hasNextPage,
      tags: edges.map(edge => ({
        lastModified: edge.node.lastModified,
        name: edge.node.name
      }))
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
      const { applicationInstances, imageRepository } = node;
      const apps = applicationInstances.map(app => ({
        affiliation: app.affiliation.name,
        environment: app.environment,
        name: node.name,
        pods: app.details.podResources,
        repository: imageRepository.repository,
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
