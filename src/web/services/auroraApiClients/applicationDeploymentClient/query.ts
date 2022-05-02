import gql from 'graphql-tag';
import { IGitInfo, ILink } from 'web/models/ApplicationDeployment';
import { IPodResource } from 'web/models/Pod';
import { StatusCode } from 'web/models/Status';
import { IImageTag } from '../imageRepositoryClient/query';

export interface IApplicationsConnectionData {
  applications?: {
    edges: IApplicationEdge[];
  };
}

export interface IApplicationEdge {
  node: IApplication;
}

export interface IApplication {
  name: string;
  applicationDeployments: IApplicationDeploymentData[];
}

export interface IImageRepository {
  repository: string;
  guiUrl?: string;
  isFullyQualified?: boolean;
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

export interface IApplicationDeploymentData {
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

export interface IRoute {
  websealJobs: IWebsealJob[];
  bigipJobs: IBigipJob[];
}

export interface IWebsealJob {
  id: string;
  payload: string;
  type: string;
  operation: string;
  status: string;
  updated: string;
  errorMessage: string | null;
  host: string | null;
  roles: string[] | null;
  routeName: string | null;
}

export interface IBigipJob {
  id: string;
  payload: string;
  type: string;
  operation: string;
  status: string;
  updated: string;
  errorMessage: string | null;
  asmPolicy: string | null;
  externalHost: string | null;
  apiPaths: string[] | null;
  oauthScopes: string[] | null;
  hostname: string | null;
  serviceName: string | null;
  name: string | null;
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
              isFullyQualified
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
  applicationDeploymentDetails?: IApplicationDeploymentDetails;
}

export interface IApplicationDeploymentDetails {
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
  applicationDeploymentCommand: {
    applicationDeploymentRef: {
      application: string;
      environment: string;
    };
    auroraConfig: {
      gitReference: string;
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

enum AuroraConfigFileType {
  DEFAULT = 'DEFAULT',
  GLOBAL = 'GLOBAL',
  GLOBAL_OVERRIDE = 'GLOBAL_OVERRIDE',
  BASE = 'BASE',
  BASE_OVERRIDE = 'BASE_OVERRIDE',
  INCLUDE_ENV = 'INCLUDE_ENV',
  ENV = 'ENV',
  ENV_OVERRIDE = 'ENV_OVERRIDE',
  APP = 'APP',
  APP_OVERRIDE = 'APP_OVERRIDE',
}

export interface AuroraConfigFileResource {
  name: string;
  contents: string;
  type: AuroraConfigFileType;
  contentHash: string;
}

export interface IApplicationDeploymentWithDetails
  extends IApplicationDeploymentData {
  details: IApplicationDeploymentDetails;
  route?: IRoute;
}

export interface IApplicationDeploymentWithDetailsData {
  applicationDeployment: IApplicationDeploymentWithDetails;
}

export interface AuroraConfigResponse {
  auroraConfig: {
    applicationFiles: ApplicationFiles[];
  };
}

interface ApplicationFiles {
  files: AuroraConfigFileResource[];
  application: string;
  environment: string;
}

export const APPLICATION_FILES_QUERY = gql`
  query getApplicationFiles(
    $auroraConfig: String!
    $applicationDeploymentRefInput: ApplicationDeploymentRefInput!
    $refName: String
  ) {
    auroraConfig(name: $auroraConfig, refInput: $refName) {
      applicationFiles(
        applicationDeploymentRefs: [$applicationDeploymentRefInput]
        types: [APP]
      ) {
        files {
          name
          contents
          type
          contentHash
        }
        environment
        application
      }
    }
  }
`;

export const APPLICATION_DEPLOYMENT_WITH_DETAILS_QUERY = gql`
  query getDeployment($id: String!) {
    applicationDeployment(id: $id) {
      id
      name
      imageRepository {
        repository
        guiUrl
        isFullyQualified
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
          image {
            buildTime
          }
        }
        releaseTo
      }
      time
      message
      details {
        updatedBy
        buildTime
        gitInfo {
          commitId
          commitTime
        }
        applicationDeploymentCommand {
          applicationDeploymentRef {
            application
            environment
          }
          auroraConfig {
            gitReference
          }
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
      route {
        websealJobs {
          id
          payload
          type
          operation
          status
          updated
          errorMessage
          host
          roles
          routeName
        }
        bigipJobs {
          id
          payload
          type
          operation
          status
          updated
          errorMessage
          asmPolicy
          externalHost
          apiPaths
          oauthScopes
          hostname
          serviceName
          name
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
