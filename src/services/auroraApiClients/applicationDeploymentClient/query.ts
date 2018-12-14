import gql from 'graphql-tag';
import { IPodResource } from 'models/Pod';
import { StatusCode } from 'models/Status';
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

export interface IPermission {
  paas: IPermissionDetails;
}

interface IPermissionDetails {
  admin: boolean;
  view: boolean;
}

export interface IStatusCheck {
  name: string;
  description: string;
  failLevel: StatusCode;
  hasFailed: boolean;
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
    permission: IPermission;
  };
  status: {
    code: StatusCode;
    reasons: IStatusCheck[];
    details: IStatusCheck[];
  };
  version: {
    auroraVersion?: string;
    deployTag: IImageTag;
    releaseTo?: string;
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
              permission {
                paas {
                  view
                  admin
                }
              }
            }
            status {
              code
              reasons {
                ...statusCheck
              }
              details {
                ...statusCheck
              }
            }
            version {
              auroraVersion
              deployTag {
                name
                type
              }
              releaseTo
            }
            time
          }
        }
      }
    }
  }

  fragment statusCheck on StatusCheck {
    name
    description
    failLevel
    hasFailed
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
            hasResponse
            textResponse
            createdAt
            httpCode
            url
            error {
              code
              message
            }
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
    affiliations(checkForVisibility: true) {
      edges {
        node {
          name
        }
      }
    }
  }
`;
