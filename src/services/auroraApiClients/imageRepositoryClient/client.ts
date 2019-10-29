import GoboClient, { IDataAndErrors } from 'services/GoboClient';
import { ITagsQuery, TAGS_QUERY } from './query';
import { ImageTagType } from 'models/ImageTagType';

interface IImageTagsVariables {
  cursor?: string;
  first: number;
  repositories: string[];
  types?: string[];
}

export class ImageRepositoryClient {
  private client: GoboClient;

  constructor(client: GoboClient) {
    this.client = client;
  }

  public async searchTagsPaged(
    repository: string,
    first: number,
    filter: string,
    cursor?: string
  ): Promise<IDataAndErrors<ITagsQuery> | undefined> {
    return await this.client.query<ITagsQuery>({
      query: TAGS_QUERY,
      variables: {
        cursor,
        first,
        filter,
        repositories: [repository]
      }
    });
  }

  public async findTagsPaged(
    repository: string,
    type: string,
    first: number,
    cursor?: string
  ): Promise<IDataAndErrors<ITagsQuery> | undefined> {
    const isSearch = type === ImageTagType.SEARCH;
    let variables: IImageTagsVariables = {
      cursor,
      first,
      repositories: [repository]
    };

    if (!isSearch) {
      variables.types = [type];
    }

    return await this.client.query<ITagsQuery>({
      query: TAGS_QUERY,
      variables
    });
  }
}
