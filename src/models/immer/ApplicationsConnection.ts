import { immerable } from 'immer';
import { IApplicationsConnectionData } from 'services/auroraApiClients/applicationDeploymentClient/query';
import { IApplicationDeployment } from 'models/ApplicationDeployment';

export class ApplicationsConnection {
  [immerable] = true;

  private applicationDeployments: IApplicationDeployment[];

  constructor(data: IApplicationsConnectionData) {
    this.applicationDeployments = this.toApplicationDeployments(data);
  }

  public update(data: IApplicationsConnectionData): void {
    this.applicationDeployments = this.toApplicationDeployments(data);
  }

  public getApplicationDeployments(): IApplicationDeployment[] {
    return this.applicationDeployments;
  }

  public getCacheTime(): string {
    if (this.applicationDeployments.length > 0) {
      return this.applicationDeployments[0].time;
    }
    return '';
  }

  public updateApplicationDeployment(deployment: IApplicationDeployment) {
    this.applicationDeployments = this.applicationDeployments.map(app => {
      if (
        app.name === deployment.name &&
        app.namespace === deployment.namespace
      ) {
        return deployment;
      } else {
        return app;
      }
    });
  }

  private toApplicationDeployments(
    data: IApplicationsConnectionData
  ): IApplicationDeployment[] {
    if (!data.applications) {
      return [];
    }

    return data.applications.edges.reduce(
      (acc: IApplicationDeployment[], { node }) => {
        const { applicationDeployments } = node;
        const deployments = applicationDeployments.map(app => ({
          affiliation: app.affiliation.name,
          environment: app.environment,
          id: app.id,
          name: app.name,
          namespace: app.namespace.name,
          permission: app.namespace.permission,
          imageRepository: app.imageRepository,
          status: {
            code: app.status.code,
            reasons: app.status.reasons,
            reports: app.status.reports
          },
          message: app.message,
          time: app.time,
          version: {
            releaseTo: app.version.releaseTo,
            auroraVersion: app.version.auroraVersion,
            deployTag: {
              lastModified: '',
              name: app.version.deployTag.name,
              type: app.version.deployTag.type
            }
          }
        }));
        return [...acc, ...deployments];
      },
      []
    );
  }
}
