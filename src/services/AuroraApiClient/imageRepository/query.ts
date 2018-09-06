import gql from 'graphql-tag';
import { IPageInfo } from '../types';

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

export interface ITagsQuery {
  imageRepositories: Array<{
    tags: IImageTagsConnection;
  }>;
}

export interface ITagsGroupedQuery {
  imageRepositories: IImageRepositoryGrouped[];
}

export interface IImageRepositoryGrouped {
  major: IImageTagsConnection;
  minor: IImageTagsConnection;
  bugfix: IImageTagsConnection;
  latest: IImageTagsConnection;
  snapshot: IImageTagsConnection;
  auroraVersion: IImageTagsConnection;
}

export interface IImageTagsConnection {
  pageInfo: IPageInfo;
  edges: Array<{
    node: {
      name: string;
      lastModified: string;
    };
  }>;
}

export const TAGS_QUERY = gql`
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

export const TAGS_GROUPED_QUERY = gql`
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
