import { default as gql } from 'graphql-tag';

export const USER_AFFILIATIONS_QUERY = gql`
  {
    currentUser {
      name
    }
    affiliations {
      edges {
        node {
          name
        }
      }
    }
  }
`;

export interface IUserAffiliationsQuery {
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

export const APPLICATIONS_QUERY = gql`
  query getApplications($affiliations: [String!]) {
    applications(affiliations: $affiliations) {
      edges {
        node {
          name
          applicationInstances {
            affiliation {
              name
            }
            environment
            namespace {
              name
            }
            status {
              code
            }
            version {
              auroraVersion
              deployTag
            }
          }
        }
      }
    }
  }
`;

export interface IApplications {
  applications: {
    edges: IApplicationEdge[];
  };
}

interface IApplicationEdge {
  node: {
    name: string;
    applicationInstances: Array<{
      affiliation: {
        name: string;
      };
      environment: string;
      namespace: {
        name: string;
      };
      status: {
        code: string;
      };
      version: {
        auroraVersion: string;
        deployTag: string;
      };
    }>;
  };
}
