import gql from 'graphql-tag';
import { ImageTagType } from 'models/ImageTagType';

export interface ITagsQuery {
  imageRepositories: Array<{
    tags: IImageTagsConnection;
  }>;
}

export interface ITagQuery {
  tag: IImageTag;
}

export interface IPageInfo {
  endCursor: string;
  hasNextPage: boolean;
}

export interface IImageTagEdge {
  node: IImageTag;
}

export interface IImageTagsConnection {
  pageInfo: IPageInfo;
  totalCount: number;
  edges: IImageTagEdge[];
}

export interface IImageTag {
  name: string;
  type: ImageTagType;
  image?: {
    buildTime: string;
  };
}

export const TAGS_QUERY = gql`
  query getTags(
    $repositories: [String!]!
    $cursor: String
    $types: [ImageTagType!]
    $first: Int!
    $filter: String
  ) {
    imageRepositories(repositories: $repositories) {
      tags(types: $types, first: $first, after: $cursor, filter: $filter) {
        pageInfo {
          endCursor
          hasNextPage
        }
        totalCount
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

export const TAG_QUERY = gql`
  query getTag($repositories: [String!]!, $names: [String!]!) {
    imageRepositories(repositories: $repositories) {
      tag(names: $names) {
        name
        type
        image {
          buildTime
        }
      }
    }
  }
`;
