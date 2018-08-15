import gql from 'graphql-tag';

export const TAGS_QUERY = gql`
  query getTags(
    $repositories: [String!]!
    $cursor: String
    $types: [ImageTagType!]
  ) {
    imageRepositories(repositories: $repositories) {
      tags(types: $types, first: 20, after: $cursor) {
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
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

export interface IPageInfo {
  startCursor: string;
  endCursor: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ITagsQuery {
  imageRepositories: Array<{
    __typename?: string;
    tags: {
      pageInfo: IPageInfo;
      edges: Array<{
        node: {
          name: string;
          lastModified: string;
        };
      }>;
    };
  }>;
}
