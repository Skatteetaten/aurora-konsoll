import { IDeploymentSpec } from 'models/DeploymentSpec';
import { IPodResource } from 'models/Pod';
import { ITag } from 'models/Tag';
import { IPermission } from 'services/auroraApiClients/applicationDeploymentClient/query';

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
}

export interface IApplicationDeploymentStatus {
  code: string;
  comment?: string;
}

export interface IApplicationDeploymentDetails {
  deploymentSpec?: IDeploymentSpec;
  pods: IPodResource[];
}

export interface IUserAndAffiliations {
  affiliations: string[];
  user: string;
}
