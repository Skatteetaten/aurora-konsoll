import GoboClient, { IDataAndErrors } from 'web/services/GoboClient';
import { ITagsQuery, TAGS_QUERY, ITagQuery, TAG_QUERY } from './query';
import { ImageTagType } from 'web/models/ImageTagType';

interface IImageTagsVariables {
  cursor?: string;
  first: number;
  repositories: string[];
  types?: string[];
}

const {
  AURORA_SNAPSHOT_VERSION,
  AURORA_VERSION,
  BUGFIX,
  COMMIT_HASH,
  LATEST,
  MAJOR,
  MINOR,
  SEARCH,
  SNAPSHOT,
} = ImageTagType;

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

  public async searchTagsPaged(
    repository: string,
    first: number,
    filter: string,
    cursor?: string
  ): Promise<IDataAndErrors<ITagsQuery>> {
    return await this.client.query<ITagsQuery>({
      query: TAGS_QUERY,
      variables: {
        cursor,
        first,
        filter,
        repositories: [repository],
      },
    });
  }

  public async findTagsPaged(
    repository: string,
    type: string,
    first: number,
    cursor?: string
  ): Promise<IDataAndErrors<ITagsQuery>> {
    const isSearch = type === SEARCH;
    let variables: IImageTagsVariables = {
      cursor,
      first,
      repositories: [repository],
    };

    if (!isSearch) {
      variables.types = [type];
    }

    return await this.client.query<ITagsQuery>({
      query: TAGS_QUERY,
      variables,
    });
  }

  public async fetchInitVersions(
    repository: string
  ): Promise<Record<ImageTagType, IDataAndErrors<ITagsQuery>>> {
    const [
      major,
      minor,
      bugfix,
      latest,
      snapshot,
      commitHash,
      uniqueSnapshot,
      auroraVersion,
    ] = await Promise.all([
      this.findTagsPaged(repository, MAJOR, 15),
      this.findTagsPaged(repository, MINOR, 15),
      this.findTagsPaged(repository, BUGFIX, 15),
      this.findTagsPaged(repository, LATEST, 1),
      this.findTagsPaged(repository, SNAPSHOT, 15),
      this.findTagsPaged(repository, COMMIT_HASH, 15),
      this.findTagsPaged(repository, AURORA_SNAPSHOT_VERSION, 15),
      this.findTagsPaged(repository, AURORA_VERSION, 15),
    ]);

    return {
      [MAJOR]: major,
      [MINOR]: minor,
      [BUGFIX]: bugfix,
      [LATEST]: latest,
      [SNAPSHOT]: snapshot,
      [COMMIT_HASH]: commitHash,
      [AURORA_VERSION]: auroraVersion,
      [AURORA_SNAPSHOT_VERSION]: uniqueSnapshot,
      [SEARCH]: { name: 'search' },
    };
  }
}
