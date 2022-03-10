import gql from 'graphql-tag';
import { ImageTagType } from 'web/models/ImageTagType';

export interface ITagsQuery {
  imageRepositories: Array<{
    tags: IImageTagsConnection;
  }>;
}

export interface ITagQuery {
  imageRepositories: Array<{
    tag: IImageTag[];
  }>;
}

export interface IImageTagEdge {
  node: IImageTag;
}

export interface IImageTagsConnection {
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
  ) {
    imageRepositories(repositories: $repositories) {
      tags {
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
