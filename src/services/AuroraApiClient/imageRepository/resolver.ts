import ApolloClient from 'apollo-boost';

import { ITagsPaged } from '../types';

import {
  IImageTagsConnection,
  ITagsGroupedQuery,
  ITagsQuery,
  TAGS_GROUPED_QUERY,
  TAGS_QUERY
} from './query';
import { ITagsPagedGroup, TagsPagedGroup } from './TagsPagedGroup';

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

  return toTagsPaged(imageRepositories[0].tags);
}

export async function findGroupedTagsPaged(
  client: ApolloClient<{}>,
  repository: string
): Promise<TagsPagedGroup> {
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

  const normalizedTags: ITagsPagedGroup = {
    auroraVersion: toTagsPaged(mainRepo.auroraVersion),
    bugfix: toTagsPaged(mainRepo.bugfix),
    latest: toTagsPaged(mainRepo.latest),
    major: toTagsPaged(mainRepo.major),
    minor: toTagsPaged(mainRepo.minor),
    snapshot: toTagsPaged(mainRepo.snapshot)
  };

  return new TagsPagedGroup(normalizedTags);
}

function toTagsPaged(imageTagsConnection: IImageTagsConnection): ITagsPaged {
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
