import { IDeploymentSpec } from 'models/DeploymentSpec';
import { IPodResource } from 'models/Pod';
import {
  IPermission,
  IStatusCheck,
  IImageRepository,
} from 'services/auroraApiClients/applicationDeploymentClient/query';
import { StatusCode } from './Status';
import { IImageTag } from 'services/auroraApiClients/imageRepositoryClient/query';

export interface IApplicationDeployment {
  id: string;
  affiliation: string;
  name: string;
  namespace: string;
  imageRepository?: IImageRepository;
  environment: string;
  status: IApplicationDeploymentStatus;
  version: {
    auroraVersion?: string;
    deployTag: IImageTag;
    releaseTo?: string;
  };
  permission: IPermission;
  time: string;
  message?: string;
}

export interface IApplicationDeploymentStatus {
  code: StatusCode;
  reasons: IStatusCheck[];
  reports: IStatusCheck[];
}

export interface IApplicationDeploymentDetails {
  updatedBy?: string;
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
