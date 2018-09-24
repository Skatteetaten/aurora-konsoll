import gql from 'graphql-tag';

export interface IApplications {
  applications: {
    edges: IApplicationEdge[];
  };
}

export interface IApplicationEdge {
  node: {
    imageRepository?: IImageRepository;
    applicationDeployments: IApplicationDeploymentQuery[];
  };
}

export interface IImageRepository {
  repository: string;
}

export interface IApplicationDeploymentQuery {
  name: string;
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
  details: {
    podResources: IPodResource[];
  };
}

export interface IPodResource {
  name: string;
  status: string;
  restartCount: number;
  ready: boolean;
  startTime: string;
  managementResponses: {
    health: {
      loadedTime: string;
      textResponse: string;
    };
  };
  links: Array<{
    name: string;
    url: string;
  }>;
}

export const APPLICATIONS_QUERY = gql`
  query getApplicationDeployments($affiliations: [String!]!) {
    applications(affiliations: $affiliations) {
      edges {
        node {
          imageRepository {
            repository
          }
          applicationDeployments {
            name
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
            details {
              podResources {
                name
                status
                restartCount
                ready
                startTime
                managementResponses {
                  health {
                    loadedTime
                    textResponse
                  }
                }
                links {
                  name
                  url
                }
              }
            }
          }
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

export const USER_AFFILIATIONS_QUERY = gql`
  query getUserAndAffiliations {
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
