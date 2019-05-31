import { IDeploymentSpec } from 'models/DeploymentSpec';
import { IPodResource, IManagementEndpointError } from 'models/Pod';
import { ITag } from 'models/Tag';
import {
  IPermission,
  IStatusCheck
} from 'services/auroraApiClients/applicationDeploymentClient/query';
import { StatusCode } from './Status';

export interface IApplicationDeployment {
  id: string;
  affiliation: string;
  name: string;
  environment: string;
  status: IApplicationDeploymentStatus;
  version: {
    auroraVersion?: string;
    deployTag: ITag;
    releaseTo?: string;
  };
  permission: IPermission;
  repository: string;
  time: string;
  message?: string;
}

export interface IApplicationDeploymentStatus {
  code: StatusCode;
  reasons: IStatusCheck[];
  reports: IStatusCheck[];
}

export interface IApplicationDeploymentDetails {
  buildTime?: string;
  gitInfo?: IGitInfo;
  deploymentSpec?: IDeploymentSpec;
  pods: IPodResource[];
  serviceLinks: ILink[];
}

export interface IGitInfo {
  commitId?: string;
  commitTime?: string;
}

export interface IGitInfo {
  commitId?: string;
  commitTime?: string;
}

export interface IUserAndAffiliations {
  affiliations: string[];
  user: string;
  id: string;
}

export interface ILink {
  name: string;
  url: string;
}

export interface IInformationView {
  healthStatus: JSX.Element;
  name: JSX.Element;
  startedDate: string;
  numberOfRestarts: number;
  externalLinks: JSX.Element;
}
