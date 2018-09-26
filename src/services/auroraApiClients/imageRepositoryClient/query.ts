import gql from 'graphql-tag';
import { ImageTagType } from 'services/TagService';

export interface ITagsQuery {
  imageRepositories: Array<{
    tags: IImageTagsConnection;
  }>;
}

export interface ITagsGroupedQuery {
  imageRepositories: IImageRepositoryGrouped[];
}

interface IImageRepositoryGrouped {
  major: IImageTagsConnection;
  minor: IImageTagsConnection;
  bugfix: IImageTagsConnection;
  latest: IImageTagsConnection;
  snapshot: IImageTagsConnection;
  auroraVersion: IImageTagsConnection;
}

export interface IImageTagsConnection {
  pageInfo: {
    endCursor: string;
    hasNextPage: boolean;
  };
  edges: Array<{
    node: IImageTag;
  }>;
}

export interface IImageTag {
  name: string;
  type: ImageTagType;
  lastModified: string;
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
            type
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
      major: tags(types: MAJOR, first: 15) {
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
      minor: tags(types: MINOR, first: 15) {
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
      bugfix: tags(types: BUGFIX, first: 15) {
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
      latest: tags(types: LATEST, first: 1) {
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
      snapshot: tags(types: SNAPSHOT, first: 15) {
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
      auroraVersion: tags(types: AURORA_VERSION, first: 15) {
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
