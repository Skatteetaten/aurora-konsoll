import gql from 'graphql-tag';
import { IImageTag } from '../imageRepositoryClient/query';

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
  id: string;
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
    comment?: string;
  };
  version: {
    auroraVersion: string;
    deployTag: IImageTag;
  };
  time: string;
}

export const APPLICATIONS_QUERY = gql`
  query getApplicationDeployments($affiliations: [String!]!) {
    applications(affiliations: $affiliations) {
      edges {
        node {
          name
          imageRepository {
            repository
          }
          applicationDeployments {
            id
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
              comment
            }
            version {
              auroraVersion
              deployTag {
                name
                type
              }
            }
            time
          }
        }
      }
    }
  }
`;

export interface IApplicationDeploymentDetailsQuery {
  applicationDeploymentDetails: {
    podResources: IPodResource[];
    deploymentSpecs: {
      current: {
        jsonRepresentation: string;
      };
    };
  };
}

export interface IPodResource {
  name: string;
  status: string;
  restartCount: number;
  ready: boolean;
  startTime: string;
  managementResponses?: {
    health?: IHttpResponse;
  };
  links: Array<{
    name: string;
    url: string;
  }>;
}

export interface IHttpResponse {
  loadedTime: string;
  textResponse: string;
}

export const APPLICATION_DEPLOYMENT_DETAILS_QUERY = gql`
  query getApplicationDeploymentDetails($id: String!) {
    applicationDeploymentDetails(id: $id) {
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
      deploymentSpecs {
        current {
          jsonRepresentation
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
