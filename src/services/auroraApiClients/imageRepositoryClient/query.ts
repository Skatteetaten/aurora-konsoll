import gql from 'graphql-tag';
import { ImageTagType } from 'models/ImageTagType';

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
  auroraSnapshotVersion: IImageTagsConnection;
  commitHash: IImageTagsConnection;
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
  image: {
    buildTime: string;
  }
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
            image {
              buildTime
            }
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
        ...imageTagFields
      }
      minor: tags(types: MINOR, first: 15) {
        ...imageTagFields
      }
      bugfix: tags(types: BUGFIX, first: 15) {
        ...imageTagFields
      }
      latest: tags(types: LATEST, first: 1) {
        ...imageTagFields
      }
      snapshot: tags(types: SNAPSHOT, first: 15) {
        ...imageTagFields
      }
      auroraVersion: tags(types: AURORA_VERSION, first: 10) {
        ...imageTagFields
      }
      auroraSnapshotVersion: tags(types: AURORA_SNAPSHOT_VERSION, first: 6) {
        ...imageTagFields
      }
      commitHash: tags(types: COMMIT_HASH, first: 6) {
        ...imageTagFields
      }
    }
  }

  fragment imageTagFields on ImageTagsConnection {
    pageInfo {
      endCursor
      hasNextPage
    }
    edges {
      node {
        name
        type
        image {
          buildTime
        }
      }
    }
  }
`;
