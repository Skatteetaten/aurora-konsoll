import gql from 'graphql-tag';

export const TAGS_QUERY = gql`
  query getTags($repositories: [String!]!, $cursor: String) {
    imageRepositories(repositories: $repositories) {
      tags(first: 20, after: $cursor) {
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

export interface IPageInfo {
  endCursor: string;
  hasNextPage: boolean;
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
