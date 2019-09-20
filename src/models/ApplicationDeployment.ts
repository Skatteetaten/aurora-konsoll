import { IDeploymentSpec } from 'models/DeploymentSpec';
import { IPodResource } from 'models/Pod';
import { ITag } from 'models/Tag';
import {
  IPermission,
  IStatusCheck,
  IImageRepository
} from 'services/auroraApiClients/applicationDeploymentClient/query';
import { StatusCode } from './Status';

export interface IApplicationDeployment {
  id: string;
  affiliation: string;
  name: string;
  imageRepository?: IImageRepository;
  environment: string;
  status: IApplicationDeploymentStatus;
  version: {
    auroraVersion?: string;
    deployTag: ITag;
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
