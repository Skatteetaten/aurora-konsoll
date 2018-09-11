import ApolloClient from 'apollo-boost';

import { ITagsPagedGroup, TagsPagedGroup } from 'services/auroraApiClients';

import {
  IImageTagsConnection,
  ITagsGroupedQuery,
  ITagsQuery,
  TAGS_GROUPED_QUERY,
  TAGS_QUERY
} from './query';

export interface ITag {
  name: string;
  lastModified: string;
}

export interface ITagsPaged {
  endCursor: string;
  hasNextPage: boolean;
  tags: ITag[];
}

export interface IImageRepositoryClient {
  findTagsPaged: (
    repository: string,
    first?: number,
    cursor?: string,
    types?: string[]
  ) => Promise<ITagsPaged>;
  findGroupedTagsPaged: (repository: string) => Promise<TagsPagedGroup>;
}

export class ImageRepositoryClient implements IImageRepositoryClient {
  private client: ApolloClient<{}>;

  constructor(client: ApolloClient<{}>) {
    this.client = client;
  }

  public async findTagsPaged(
    repository: string,
    first?: number,
    cursor?: string,
    types?: string[]
  ): Promise<ITagsPaged> {
    const result = await this.client.query<ITagsQuery>({
      query: TAGS_QUERY,
      variables: {
        cursor,
        first,
        repositories: [repository],
        types
      }
    });

    const { imageRepositories } = result.data;

    if (!(imageRepositories && imageRepositories.length > 0)) {
      throw new Error(`Could not find tags for repository ${repository}`);
    }

    return this.toTagsPaged(imageRepositories[0].tags);
  }

  public async findGroupedTagsPaged(
    repository: string
  ): Promise<TagsPagedGroup> {
    const result = await this.client.query<ITagsGroupedQuery>({
      query: TAGS_GROUPED_QUERY,
      variables: {
        repositories: [repository]
      }
    });

    const { imageRepositories } = result.data;

    if (!(imageRepositories && imageRepositories.length > 0)) {
      throw new Error(`Could not find tags for repository ${repository}`);
    }

    const [mainRepo] = imageRepositories;

    const normalizedTags: ITagsPagedGroup = {
      auroraVersion: this.toTagsPaged(mainRepo.auroraVersion),
      bugfix: this.toTagsPaged(mainRepo.bugfix),
      latest: this.toTagsPaged(mainRepo.latest),
      major: this.toTagsPaged(mainRepo.major),
      minor: this.toTagsPaged(mainRepo.minor),
      snapshot: this.toTagsPaged(mainRepo.snapshot)
    };

    return new TagsPagedGroup(normalizedTags);
  }
  private toTagsPaged(imageTagsConnection: IImageTagsConnection): ITagsPaged {
    const { edges, pageInfo } = imageTagsConnection;
    return {
      endCursor: pageInfo.endCursor,
      hasNextPage: pageInfo.hasNextPage,
      tags: edges.map(edge => ({
        lastModified: edge.node.lastModified,
        name: edge.node.name
      }))
    };
  }
}
