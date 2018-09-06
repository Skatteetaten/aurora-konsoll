import ApolloClient from 'apollo-boost';

import { ITagsPaged } from '../types';

import {
  IImageRepositoryGrouped,
  IImageTagsConnection,
  ITagsGroupedQuery,
  ITagsQuery,
  TAGS_GROUPED_QUERY,
  TAGS_QUERY
} from './query';

export interface ITagsGrouped {
  MAJOR: ITagsPaged;
  MINOR: ITagsPaged;
  BUGFIX: ITagsPaged;
  LATEST: ITagsPaged;
  SNAPSHOT: ITagsPaged;
  AURORA_VERSION: ITagsPaged;
}

export async function findTagsPaged(
  client: ApolloClient<{}>,
  repository: string,
  first?: number,
  cursor?: string,
  types?: string[]
): Promise<ITagsPaged> {
  const result = await client.query<ITagsQuery>({
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

  const [mainRepo] = imageRepositories;

  const { pageInfo, edges } = mainRepo.tags;

  return {
    endCursor: pageInfo.endCursor,
    hasNextPage: pageInfo.hasNextPage,
    tags: edges.map(edge => ({
      lastModified: edge.node.lastModified,
      name: edge.node.name
    }))
  };
}

export async function findGroupedTagsPaged(
  client: ApolloClient<{}>,
  repository: string
): Promise<ITagsGrouped> {
  const result = await client.query<ITagsGroupedQuery>({
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

  return normalizeImageRepositoryGrouped(mainRepo);
}

function normalizeImageRepositoryGrouped(
  imageRepository: IImageRepositoryGrouped
): ITagsGrouped {
  return Object.keys(imageRepository)
    .filter(tagName => tagName !== '__typename')
    .reduce(
      (acc, tagName) => {
        const tagInfo: IImageTagsConnection = imageRepository[tagName];
        const { edges, pageInfo } = tagInfo;
        return {
          ...acc,
          [tagName]: {
            endCursor: pageInfo.endCursor,
            hasNextPage: pageInfo.hasNextPage,
            tags: edges.map(edge => ({
              lastModified: edge.node.lastModified,
              name: edge.node.name
            }))
          }
        };
      },
      {} as ITagsGrouped
    );
}
