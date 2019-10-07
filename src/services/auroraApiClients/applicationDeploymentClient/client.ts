import GoboClient, { IGoboResult } from 'services/GoboClient';
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
  IApplicationsConnectionQuery,
  IUserAffiliationsQuery,
  USER_AFFILIATIONS_QUERY
} from './query';

export class ApplicationDeploymentClient {
  private client: GoboClient;

  constructor(client: GoboClient) {
    this.client = client;
  }

  public async redeployWithVersion(
    applicationDeploymentId: string,
    version: string
  ): Promise<IGoboResult<{ redeployWithVersion: boolean }> | undefined> {
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
  ): Promise<IGoboResult<{ redeployWithCurrentVersion: boolean }> | undefined> {
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
  ): Promise<
    IGoboResult<{ refreshApplicationDeployment: string }> | undefined
  > {
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
  ): Promise<IGoboResult<{ affiliations: string[] }> | undefined> {
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
  ): Promise<IGoboResult<IApplicationDeploymentDetailsQuery> | undefined> {
    return await this.client.query<IApplicationDeploymentDetailsQuery>({
      query: APPLICATION_DEPLOYMENT_DETAILS_QUERY,
      variables: {
        id
      }
    });
  }

  public async findUserAndAffiliations(): Promise<
    IGoboResult<IUserAffiliationsQuery> | undefined
  > {
    return await this.client.query<IUserAffiliationsQuery>({
      query: USER_AFFILIATIONS_QUERY
    });
  }

  public async findAllApplicationDeployments(
    affiliations: string[]
  ): Promise<IGoboResult<IApplicationsConnectionQuery> | undefined> {
    return await this.client.query<IApplicationsConnectionQuery>({
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
    IGoboResult<{ deleteApplicationDeployment: boolean }> | undefined
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
