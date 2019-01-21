import gql from 'graphql-tag';

import { IUserAndAffiliations } from 'models/ApplicationDeployment';
import { queryCreator } from '../../GraphQLRestMapper';

interface IUserAffiliationsQuery {
  currentUser: {
    name: string;
  };
  affiliations: {
    edges: Array<{
      node: {
        name: string;
      };
    }>;
  };
}

const USER_AFFILIATIONS_QUERY = gql`
  query getUserAndAffiliations {
    currentUser {
      name
    }
    affiliations(checkForVisibility: true) {
      edges {
        node {
          name
        }
      }
    }
  }
`;

export const getUserAndAffiliations = queryCreator<
  IUserAffiliationsQuery,
  IUserAndAffiliations
>(USER_AFFILIATIONS_QUERY, data => ({
  affiliations: data.affiliations.edges.map(edge => edge.node.name),
  user: data.currentUser.name
}));
