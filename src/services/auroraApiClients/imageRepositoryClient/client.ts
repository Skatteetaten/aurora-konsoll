import ApolloClient from 'apollo-boost';

import { errorStateManager } from 'models/StateManager/ErrorStateManager';
import { defaultTagsPagedGroup, ITagsPaged, ITagsPagedGroup } from 'models/Tag';
import {
  IImageTagsConnection,
  ITagsGroupedQuery,
  ITagsQuery,
  TAGS_GROUPED_QUERY,
  TAGS_QUERY
} from './query';

export class ImageRepositoryClient {
  private client: ApolloClient<{}>;

  constructor(client: ApolloClient<{}>) {
    this.client = client;
  }

  public async findTagsPaged(
    repository: string,
    type: string,
    first?: number,
    cursor?: string
  ): Promise<ITagsPaged> {
    const result = await this.client.query<ITagsQuery>({
      query: TAGS_QUERY,
      variables: {
        cursor,
        first,
        repositories: [repository],
        types: [type]
      }
    });

    const { imageRepositories } = result.data;

    if (!(imageRepositories && imageRepositories.length > 0)) {
      errorStateManager.addError(
        new Error(`Kunne ikke finne repository for denne applikasjonen`)
      );
      return defaultTagsPagedGroup()[type];
    }

    return this.toTagsPaged(imageRepositories[0].tags);
  }

  public async findGroupedTagsPaged(
    repository: string
  ): Promise<ITagsPagedGroup> {
    const result = await this.client.query<ITagsGroupedQuery>({
      query: TAGS_GROUPED_QUERY,
      variables: {
        repositories: [repository]
      }
    });

    const { imageRepositories } = result.data;

    if (!(imageRepositories && imageRepositories.length > 0)) {
      errorStateManager.addError(
        new Error(`Kunne ikke finne repository for denne applikasjonen`)
      );
      return defaultTagsPagedGroup();
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

    return normalizedTags;
  }

  private toTagsPaged(imageTagsConnection: IImageTagsConnection): ITagsPaged {
    const { edges, pageInfo } = imageTagsConnection;
    return {
      endCursor: pageInfo.endCursor,
      hasNextPage: pageInfo.hasNextPage,
      tags: edges.map(edge => ({
        lastModified: edge.node.lastModified,
        name: edge.node.name,
        type: edge.node.type
      }))
    };
  }
}
