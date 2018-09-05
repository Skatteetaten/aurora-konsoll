import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';
import { IPageInfo, ITagsPaged } from './types';

const MAJOR = 'MAJOR';
const MINOR = 'MINOR';
const BUGFIX = 'BUGFIX';
const LATEST = 'LATEST';
const SNAPSHOT = 'SNAPSHOT';
const AURORA_VERSION = 'AURORA_VERSION';

export const versionStrategies = {
  AURORA_VERSION,
  BUGFIX,
  LATEST,
  MAJOR,
  MINOR,
  SNAPSHOT
};

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
  const result = await client.query<IGroupedTagsQuery>({
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

interface ITagsQuery {
  imageRepositories: Array<{
    tags: IImageTagsConnection;
  }>;
}

const TAGS_QUERY = gql`
  query getTags(
    $repositories: [String!]!
    $cursor: String!
    $types: [ImageTagType!]
    $first: Int
  ) {
    imageRepositories(repositories: $repositories) {
      tags(types: $types, first: $first, after: $cursor) {
        pageInfo {
          endCursor
          hasNextPage
        }
        edges {
          node {
            name
            lastModified
          }
        }
      }
    }
  }
`;

interface IImageTagsConnection {
  pageInfo: IPageInfo;
  edges: Array<{
    node: {
      name: string;
      lastModified: string;
    };
  }>;
}

interface IImageRepositoryGrouped {
  major: IImageTagsConnection;
  minor: IImageTagsConnection;
  bugfix: IImageTagsConnection;
  latest: IImageTagsConnection;
  snapshot: IImageTagsConnection;
  auroraVersion: IImageTagsConnection;
}

interface IGroupedTagsQuery {
  imageRepositories: IImageRepositoryGrouped[];
}

const TAGS_GROUPED_QUERY = gql`
  query getTagsGrouped($repositories: [String!]!) {
    imageRepositories(repositories: $repositories) {
      ${MAJOR}: tags(types: MAJOR, first: 15) {
        pageInfo {
          endCursor
          hasNextPage
        }
        edges {
          node {
            name
            lastModified
          }
        }
      }
      ${MINOR}: tags(types: MINOR, first: 15) {
        pageInfo {
          endCursor
          hasNextPage
        }
        edges {
          node {
            name
            lastModified
          }
        }
      }
      ${BUGFIX}: tags(types: BUGFIX, first: 15) {
        pageInfo {
          endCursor
          hasNextPage
        }
        edges {
          node {
            name
            lastModified
          }
        }
      }
      ${LATEST}: tags(types: LATEST, first: 1) {
        pageInfo {
          endCursor
          hasNextPage
        }
        edges {
          node {
            name
            lastModified
          }
        }
      }
      ${SNAPSHOT}: tags(types: SNAPSHOT, first: 15) {
        pageInfo {
          endCursor
          hasNextPage
        }
        edges {
          node {
            name
            lastModified
          }
        }
      }
      ${AURORA_VERSION}: tags(types: AURORA_VERSION, first: 15) {
        pageInfo {
          endCursor
          hasNextPage
        }
        edges {
          node {
            name
            lastModified
          }
        }
      }
    }
  }
`;
