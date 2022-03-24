import {
  IApplicationDeploymentWithDetailsData,
  IImageRepository,
  IPermission,
  IRoute,
} from 'web/services/auroraApiClients/applicationDeploymentClient/query';
import {
  IApplicationDeployment,
  IApplicationDeploymentDetails,
  IApplicationDeploymentStatus,
} from 'web/models/ApplicationDeployment';
import { immerable } from 'immer';
import {
  normalizeRawDeploymentSpec,
  IDeploymentSpec,
} from 'web/models/DeploymentSpec';
import { IImageTag } from 'web/services/auroraApiClients/imageRepositoryClient/query';

export class ApplicationDeployment implements IApplicationDeployment {
  [immerable] = true;

  public id: string;
  public affiliation: string;
  public name: string;
  public namespace: string;
  public imageRepository?: IImageRepository;
  public environment: string;
  public status: IApplicationDeploymentStatus;
  public version: {
    auroraVersion?: string;
    deployTag: IImageTag;
    releaseTo?: string;
  };
  public permission: IPermission;
  public time: string;
  public message?: string;
  public details: IApplicationDeploymentDetails;
  public route?: IRoute;

  constructor(data: IApplicationDeploymentWithDetailsData) {
    const app = data.applicationDeployment;
    const details = app.details;

    this.id = app.id;
    this.affiliation = app.affiliation.name;
    this.environment = app.environment;
    this.id = app.id;
    this.imageRepository = app.imageRepository;
    this.message = app.message;
    this.name = app.name;
    this.namespace = app.namespace.name;
    this.permission = app.namespace.permission;
    this.status = app.status;
    this.time = app.time;
    this.version = app.version;
    this.details = {
      deploymentSpec: this.toDeploymentSpec(details.deploymentSpecs.current),
      buildTime: details.buildTime,
      gitInfo: details.gitInfo,
      pods: details.podResources,
      serviceLinks: details.serviceLinks,
      updatedBy: details.updatedBy,
      applicationDeploymentCommand: details.applicationDeploymentCommand,
    };
    this.route = app.route;
  }

  private toDeploymentSpec(current?: any): IDeploymentSpec | undefined {
    if (current) {
      const spec = JSON.parse(current.jsonRepresentation);
      return Object.keys(spec).reduce(
        normalizeRawDeploymentSpec(spec),
        {} as IDeploymentSpec
      );
    }
  }
}
