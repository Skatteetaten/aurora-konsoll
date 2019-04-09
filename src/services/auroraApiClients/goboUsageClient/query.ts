import gql from 'graphql-tag';

export interface IGoboUsage {
  gobo: {
    usage: {
      users: IGoboUser[];
    };
  };
}

export interface IGoboUser {
  name: string;
  count: number;
}

export const GOBO_USERS_USAGE_QUERY = gql`
  query getGoboUsage {
    gobo {
      usage {
        users {
          name
          count
        }
      }
    }
  }
`;
