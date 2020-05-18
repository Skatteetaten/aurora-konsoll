import GoboClient, { IDataAndErrors } from 'services/GoboClient';
import {
  REDEPLOY_WITH_CURRENT_VERSION_MUTATION,
  REDEPLOY_WITH_VERSION_MUTATION,
  REFRESH_APPLICATION_DEPLOYMENT_MUTATION,
  REFRESH_APPLICATION_DEPLOYMENTS_MUTATION,
  DELETE_APPLICATION_DEPLOYMENT_MUTATION,
} from './mutation';
import {
  APPLICATION_DEPLOYMENT_DETAILS_QUERY,
  APPLICATIONS_QUERY,
  IApplicationDeploymentDetailsQuery,
  IApplicationsConnectionData,
  IUserAndAffiliationsData,
  USER_AFFILIATIONS_QUERY,
  IApplicationDeploymentWithDetailsData,
  APPLICATION_DEPLOYMENT_WITH_DETAILS_QUERY,
} from './query';

export class ApplicationDeploymentClient {
  private client: GoboClient;

  constructor(client: GoboClient) {
    this.client = client;
  }

  public async redeployWithVersionAndRefreshDeployment(
    applicationDeploymentId: string,
    version: string
  ): Promise<IDataAndErrors<IApplicationDeploymentWithDetailsData>> {
    const redeployResult = await this.redeployWithVersion(
      applicationDeploymentId,
      version
    );
    if (redeployResult.data && redeployResult.data.redeployWithVersion) {
      await this.refreshApplicationDeployment(applicationDeploymentId);
      return await this.fetchApplicationDeploymentWithDetails(
        applicationDeploymentId
      );
    } else {
      return {
        name: redeployResult.name,
        errors: redeployResult.errors,
      };
    }
  }

  public async deleteAndRefreshApplications(
    affiliation: string,
    namespace: string,
    name: string
  ): Promise<IDataAndErrors<IApplicationsConnectionData>> {
    const deleteResponse = await this.deleteApplicationDeployment(
      namespace,
      name
    );
    if (
      deleteResponse.data &&
      deleteResponse.data.deleteApplicationDeployment
    ) {
      return await this.refreshAndFetchApplications([affiliation]);
    } else {
      return {
        name: deleteResponse.name,
        errors: deleteResponse.errors,
      };
    }
  }

  public async refreshAndFetchApplicationDeployment(
    applicationDeploymentId: string
  ): Promise<IDataAndErrors<IApplicationDeploymentWithDetailsData>> {
    const refreshResult = await this.refreshApplicationDeployment(
      applicationDeploymentId
    );
    if (refreshResult.data && refreshResult.data.refreshApplicationDeployment) {
      return await this.fetchApplicationDeploymentWithDetails(
        applicationDeploymentId
      );
    } else {
      return {
        name: refreshResult.name,
        errors: refreshResult.errors,
      };
    }
  }

  public async fetchApplicationDeploymentWithDetails(
    applicationDeploymentId: string
  ): Promise<IDataAndErrors<IApplicationDeploymentWithDetailsData>> {
    return await this.client.query<IApplicationDeploymentWithDetailsData>({
      query: APPLICATION_DEPLOYMENT_WITH_DETAILS_QUERY,
      variables: {
        id: applicationDeploymentId,
      },
    });
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
          version,
        },
      },
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
          applicationDeploymentId,
        },
      },
    });
  }

  public async refreshApplicationDeployment(
    applicationDeploymentId: string
  ): Promise<IDataAndErrors<{ refreshApplicationDeployment: boolean }>> {
    return await this.client.mutate<{
      refreshApplicationDeployment: boolean;
    }>({
      mutation: REFRESH_APPLICATION_DEPLOYMENT_MUTATION,
      variables: {
        input: {
          applicationDeploymentId,
        },
      },
    });
  }

  public async refreshAndFetchApplications(
    affiliations: string[]
  ): Promise<IDataAndErrors<IApplicationsConnectionData>> {
    const refreshResponse = await this.refreshAffiliations(affiliations);
    if (
      refreshResponse.data &&
      refreshResponse.data.refreshApplicationDeployments
    ) {
      return await this.findAllApplicationDeployments(affiliations);
    } else {
      return {
        name: refreshResponse.name,
        errors: refreshResponse.errors,
      };
    }
  }

  public async refreshAffiliations(
    affiliations: string[]
  ): Promise<IDataAndErrors<{ refreshApplicationDeployments: boolean }>> {
    return await this.client.mutate<{
      refreshApplicationDeployments: boolean;
    }>({
      mutation: REFRESH_APPLICATION_DEPLOYMENTS_MUTATION,
      variables: {
        input: {
          affiliations,
        },
      },
    });
  }

  public async findApplicationDeploymentDetails(
    id: string
  ): Promise<IDataAndErrors<IApplicationDeploymentDetailsQuery> | undefined> {
    return await this.client.query<IApplicationDeploymentDetailsQuery>({
      query: APPLICATION_DEPLOYMENT_DETAILS_QUERY,
      variables: {
        id,
      },
    });
  }

  public async findUserAndAffiliations(): Promise<
    IDataAndErrors<IUserAndAffiliationsData>
  > {
    return await this.client.query<IUserAndAffiliationsData>({
      query: USER_AFFILIATIONS_QUERY,
    });
  }

  public async findAllApplicationDeployments(
    affiliations: string[]
  ): Promise<IDataAndErrors<IApplicationsConnectionData>> {
    return await this.client.query<IApplicationsConnectionData>({
      query: APPLICATIONS_QUERY,
      variables: {
        affiliations,
      },
    });
  }

  public async deleteApplicationDeployment(
    namespace: string,
    name: string
  ): Promise<IDataAndErrors<{ deleteApplicationDeployment: boolean }>> {
    return await this.client.mutate<{ deleteApplicationDeployment: boolean }>({
      mutation: DELETE_APPLICATION_DEPLOYMENT_MUTATION,
      variables: {
        input: {
          namespace,
          name,
        },
      },
    });
  }
}
