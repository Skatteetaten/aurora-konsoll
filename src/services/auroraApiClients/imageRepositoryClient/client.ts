import GoboClient, { IGoboResult } from 'services/GoboClient';
import {
  ITagsGroupedQuery,
  ITagsQuery,
  TAGS_GROUPED_QUERY,
  TAGS_QUERY
} from './query';

export class ImageRepositoryClient {
  private client: GoboClient;

  constructor(client: GoboClient) {
    this.client = client;
  }

  public async findTagsPaged(
    repository: string,
    type: string,
    first: number,
    cursor?: string
  ): Promise<IGoboResult<ITagsQuery> | undefined> {
    return await this.client.query<ITagsQuery>({
      query: TAGS_QUERY,
      variables: {
        cursor,
        first,
        repositories: [repository],
        types: [type]
      }
    });
  }

  public async findGroupedTagsPaged(
    repository: string
  ): Promise<IGoboResult<ITagsGroupedQuery> | undefined> {
    return await this.client.query<ITagsGroupedQuery>({
      query: TAGS_GROUPED_QUERY,
      variables: {
        repositories: [repository]
      }
    });
  }
}
