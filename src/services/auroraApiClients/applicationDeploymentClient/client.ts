import GoboClient, { IDataAndErrors } from 'services/GoboClient';
import {
  REDEPLOY_WITH_CURRENT_VERSION_MUTATION,
  REDEPLOY_WITH_VERSION_MUTATION,
  REFRESH_APPLICATION_DEPLOYMENT_MUTATION,
  REFRESH_APPLICATION_DEPLOYMENTS_MUTATION,
  DELETE_APPLICATION_DEPLOYMENT_MUTATION
} from './mutation';
import {
  APPLICATION_DEPLOYMENT_DETAILS_QUERY,
  APPLICATIONS_QUERY,
  IApplicationDeploymentDetailsQuery,
  IApplicationsConnectionData,
  IUserAndAffiliationsData,
  USER_AFFILIATIONS_QUERY
} from './query';

export class ApplicationDeploymentClient {
  private client: GoboClient;

  constructor(client: GoboClient) {
    this.client = client;
  }

  public async redeployWithVersionAndRefreshDeployment(
    affiliation: string,
    applicationDeploymentId: string,
    version: string
  ): Promise<IDataAndErrors<IApplicationsConnectionData>> {
    const redeployResult = await this.redeployWithVersion(
      applicationDeploymentId,
      version
    );
    if (redeployResult.data && redeployResult.data.redeployWithVersion) {
      await this.refreshApplicationDeployment(applicationDeploymentId);
      return await this.findAllApplicationDeployments([affiliation]);
    } else {
      return {
        name: redeployResult.name,
        errors: redeployResult.errors
      };
    }
  }

  public async redeployWithVersion(
    applicationDeploymentId: string,
    version: string
  ): Promise<IDataAndErrors<{ redeployWithVersion: boolean }>> {
    return await this.client.mutate<{ redeployWithVersion: boolean }>({
      mutation: REDEPLOY_WITH_VERSION_MUTATION,
      variables: {
        input: {
          applicationDeploymentId,
          version
        }
      }
    });
  }

  public async redeployWithCurrentVersion(
    applicationDeploymentId: string
  ): Promise<
    IDataAndErrors<{ redeployWithCurrentVersion: boolean }> | undefined
  > {
    return await this.client.mutate<{
      redeployWithCurrentVersion: boolean;
    }>({
      mutation: REDEPLOY_WITH_CURRENT_VERSION_MUTATION,
      variables: {
        input: {
          applicationDeploymentId
        }
      }
    });
  }

  public async refreshApplicationDeployment(
    applicationDeploymentId: string
  ): Promise<IDataAndErrors<{ refreshApplicationDeployment: string }>> {
    return await this.client.mutate<{
      refreshApplicationDeployment: string;
    }>({
      mutation: REFRESH_APPLICATION_DEPLOYMENT_MUTATION,
      variables: {
        input: {
          applicationDeploymentId
        }
      }
    });
  }

  public async refreshAffiliations(
    affiliations: string[]
  ): Promise<IDataAndErrors<{ affiliations: string[] }>> {
    return await this.client.mutate<{
      affiliations: string[];
    }>({
      mutation: REFRESH_APPLICATION_DEPLOYMENTS_MUTATION,
      variables: {
        input: {
          affiliations
        }
      }
    });
  }

  public async findApplicationDeploymentDetails(
    id: string
  ): Promise<IDataAndErrors<IApplicationDeploymentDetailsQuery> | undefined> {
    return await this.client.query<IApplicationDeploymentDetailsQuery>({
      query: APPLICATION_DEPLOYMENT_DETAILS_QUERY,
      variables: {
        id
      }
    });
  }

  public async findUserAndAffiliations(): Promise<
    IDataAndErrors<IUserAndAffiliationsData>
  > {
    return await this.client.query<IUserAndAffiliationsData>({
      query: USER_AFFILIATIONS_QUERY
    });
  }

  public async findAllApplicationDeployments(
    affiliations: string[]
  ): Promise<IDataAndErrors<IApplicationsConnectionData>> {
    return await this.client.query<IApplicationsConnectionData>({
      query: APPLICATIONS_QUERY,
      variables: {
        affiliations
      }
    });
  }

  public async deleteApplicationDeployment(
    namespace: string,
    name: string
  ): Promise<
    IDataAndErrors<{ deleteApplicationDeployment: boolean }> | undefined
  > {
    return await this.client.mutate<{ deleteApplicationDeployment: boolean }>({
      mutation: DELETE_APPLICATION_DEPLOYMENT_MUTATION,
      variables: {
        input: {
          namespace,
          name
        }
      }
    });
  }
}
