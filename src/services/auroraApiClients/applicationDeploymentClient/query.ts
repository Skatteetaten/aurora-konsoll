import gql from 'graphql-tag';
import { IPodResource } from 'models/Pod';
import { IImageTag } from '../imageRepositoryClient/query';

export interface IApplicationsConnectionQuery {
  applications: {
    edges: IApplicationEdge[];
  };
}

interface IApplicationEdge {
  node: IApplication;
}

interface IApplication {
  name: string;
  imageRepository?: IImageRepository;
  applicationDeployments: IApplicationDeployment[];
}

interface IImageRepository {
  repository: string;
}

interface IApplicationDeployment {
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
  applicationDeploymentDetails?: {
    podResources: IPodResource[];
    deploymentSpecs: {
      current?: {
        jsonRepresentation: string;
      };
    };
  };
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
    affiliations(checkForVisibility:true) {
      edges {
        node {
          name
        }
      }
    }
  }
`;
