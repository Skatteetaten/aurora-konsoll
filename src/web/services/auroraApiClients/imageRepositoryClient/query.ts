import gql from 'graphql-tag';
import { ImageTagType } from 'web/models/ImageTagType';

export interface ITagsQuery {
  imageRepositories: Array<{
    versions: IVersionsConnection;
  }>;
}

export interface ITagQuery {
  imageRepositories: Array<{
    tag: IImageTag[];
  }>;
}

export type IVersionsConnection = IVersion[];

export interface IImageTag {
  name: string;
  type: ImageTagType;
  image?: {
    buildTime: string;
  };
}

export interface IVersion {
  name: string;
  type: ImageTagType;
  version?: {
    buildTime: string;
  };
}

export const VERSIONS_QUERY = gql`
  query getVersions($repositories: [String!]!) {
    imageRepositories(repositories: $repositories) {
      versions {
        name
        type
        version {
          buildTime
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
