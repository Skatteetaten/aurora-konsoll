import GoboClient, { IGoboResult } from 'services/GoboClient';
import {
  REDEPLOY_WITH_CURRENT_VERSION_MUTATION,
  REDEPLOY_WITH_VERSION_MUTATION,
  REFRESH_APPLICATION_DEPLOYMENT_MUTATION,
  REFRESH_APPLICATION_DEPLOYMENTS_MUTATION
} from './mutation';
import {
  APPLICATION_DEPLOYMENT_DETAILS_QUERY,
  APPLICATIONS_QUERY,
  IApplicationDeploymentDetailsQuery,
  IApplicationsConnectionQuery,
  IUserAffiliationsQuery,
  USER_AFFILIATIONS_QUERY
} from './query';

export function formatName(user: string) {
  const names = user.split(', ');
  if (names.length !== 2) {
    return user;
  }
  return names[1] + ' ' + names[0];
}

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
}

// ! Temp fix for template deployments with default version
// TODO: FIX
export function findDeployTagForTemplate(
  applicationName: string,
  deployTag: string
) {
  const templates = {
    'aurora-activemq-1.0.0': '2',
    'aurora-redis-1.0.0': '3.2.3',
    'aurora-wiremock-1.0.0': '1.3.0',
    redis: '3.2.3',
    wiremock: '1.3.0'
  };

  if (deployTag) {
    return deployTag;
  }

  return templates[applicationName] || deployTag;
}
