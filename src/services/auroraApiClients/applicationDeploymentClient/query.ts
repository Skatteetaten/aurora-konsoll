import gql from 'graphql-tag';
import { IGitInfo, ILink } from 'models/ApplicationDeployment';
import { IPodResource } from 'models/Pod';
import { StatusCode } from 'models/Status';
import { IImageTag } from '../imageRepositoryClient/query';

export interface IApplicationsConnectionData {
  applications?: {
    edges: IApplicationEdge[];
  };
}

interface IApplicationEdge {
  node: IApplication;
}

interface IApplication {
  name: string;
  applicationDeployments: IApplicationDeployment[];
}

export interface IImageRepository {
  repository: string;
  guiUrl?: string;
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
  imageRepository?: IImageRepository;
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
    reports: IStatusCheck[];
  };
  version: {
    auroraVersion?: string;
    deployTag: IImageTag;
    releaseTo?: string;
  };
  message?: string;
  time: string;
}

export const APPLICATIONS_QUERY = gql`
  query getApplicationDeployments($affiliations: [String!]!) {
    applications(affiliations: $affiliations) {
      edges {
        node {
          name
          applicationDeployments {
            imageRepository {
              repository
              guiUrl
            }
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
              reports {
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
            message
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
    updatedBy?: string;
    buildTime?: string;
    gitInfo?: IGitInfo;
    serviceLinks: ILink[];
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
      updatedBy
      buildTime
      gitInfo {
        commitId
        commitTime
      }
      serviceLinks {
        name
        url
      }
      podResources {
        name
        phase
        restartCount
        ready
        startTime
        latestDeployTag
        managementResponses {
          links {
            error {
              code
              message
            }
          }
          health {
            ...managementResponse
          }
          env {
            ...managementResponse
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

  fragment managementResponse on ManagementEndpointResponse {
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
`;

export interface IUserAndAffiliationsData {
  currentUser: {
    name: string;
    id: string;
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
      id
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
