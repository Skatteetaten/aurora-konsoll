import gql from 'graphql-tag';
import { IWebsealState } from 'web/models/Webseal';

export interface IWebsealAffiliationQuery {
  affiliations: {
    edges: IWebsealStateEdge[];
  };
}
export interface IWebsealStateEdge {
  node: { websealStates: IWebsealState[] };
}

export const WEBSEAL_STATES_QUERY = gql`
  query getWebsealStates($affiliation: String!) {
    affiliations(names: [$affiliation]) {
      edges {
        node {
          websealStates {
            name
            namespace
            routeName
            acl {
              aclName
              anyOther
              open
              roles
            }
            junctions
          }
        }
      }
    }
  }
`;
