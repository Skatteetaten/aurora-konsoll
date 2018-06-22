import { default as gql } from 'graphql-tag';

export const APPLICATIONS_QUERY = gql`
  query applications($affiliations: [String!]) {
    applications(affiliations: $affiliations) {
      edges {
        node {
          affiliation {
            name
          }
          name
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
`;

export interface IApplications {
  applications: {
    edges: IApplicationEdge[];
  };
}

export interface IApplicationEdge {
  node: {
    affiliation: {
      name: string;
    };
    name: string;
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
  };
}
