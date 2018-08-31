import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';
import { IPageInfo, ITagsPaged } from './types';

export interface IGroupedTagsCursors {
  majorCursor?: string;
  minorCursor?: string;
  patchCursor?: string;
  snapshotCursor?: string;
  auroraVersionCursor?: string;
}

export interface ITagsGrouped {
  major: ITagsPaged;
  minor: ITagsPaged;
  patch: ITagsPaged;
  snapshot: ITagsPaged;
  auroraVersion: ITagsPaged;
}

export async function findGroupedTagsPaged(
  client: ApolloClient<{}>,
  repository: string,
  cursors?: IGroupedTagsCursors
): Promise<ITagsGrouped> {
  const result = await client.query<IGroupedTagsQuery>({
    query: TAGS_GROUPED_QUERY,
    variables: {
      repositories: [repository],
      ...cursors
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
  patch: IImageTagsConnection;
  snapshot: IImageTagsConnection;
  auroraVersion: IImageTagsConnection;
}

interface IGroupedTagsQuery {
  imageRepositories: IImageRepositoryGrouped[];
}

const TAGS_GROUPED_QUERY = gql`
  query getTagsGrouped(
    $repositories: [String!]!
    $majorCursor: String
    $majorCursor: String
    $minorCursor: String
    $patchCursor: String
    $snapshotCursor: String
    $auroraVersionCursor: String
  ) {
    imageRepositories(repositories: $repositories) {
      major: tags(types: MAJOR, first: 15, after: $majorCursor) {
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
      minor: tags(types: MINOR, first: 15, after: $minorCursor) {
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
      patch: tags(types: BUGFIX, first: 15, after: $patchCursor) {
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
      snapshot: tags(types: SNAPSHOT, first: 15, after: $snapshotCursor) {
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
      auroraVersion: tags(
        types: AURORA_VERSION
        first: 15
        after: $auroraVersionCursor
      ) {
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
