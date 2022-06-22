import GoboClient, { IDataAndErrors } from 'web/services/GoboClient';
import { ITagsQuery, VERSIONS_QUERY, ITagQuery, TAG_QUERY } from './query';

interface IImageTagsVariables {
  repositories: string[];
  types?: string[];
}

export class ImageRepositoryClient {
  private client: GoboClient;

  constructor(client: GoboClient) {
    this.client = client;
  }

  public async fetchTag(
    repository: string,
    tagName: string
  ): Promise<IDataAndErrors<ITagQuery>> {
    return await this.client.query<ITagQuery>({
      query: TAG_QUERY,
      variables: {
        repositories: [repository],
        names: [tagName],
      },
    });
  }

  public async findVersions(
    repository: string
  ): Promise<IDataAndErrors<ITagsQuery>> {
    let variables: IImageTagsVariables = {
      repositories: [repository],
    };

    return await this.client.query<ITagsQuery>({
      query: VERSIONS_QUERY,
      variables,
    });
  }

  public async fetchVersions(
    repository: string
  ): Promise<IDataAndErrors<ITagsQuery>> {
    return this.findVersions(repository);
  }
}
