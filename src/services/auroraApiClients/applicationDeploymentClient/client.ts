import { IUserAndAffiliations } from 'models/ApplicationDeployment';

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

function formatName(user: string) {
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
  ): Promise<boolean> {
    const result = await this.client.mutate<{ redeployWithVersion: boolean }>({
      mutation: REDEPLOY_WITH_VERSION_MUTATION,
      variables: {
        input: {
          applicationDeploymentId,
          version
        }
      }
    });

    if (result && result.data) {
      return result.data.redeployWithVersion;
    }

    return false;
  }

  public async redeployWithCurrentVersion(
    applicationDeploymentId: string
  ): Promise<boolean> {
    const result = await this.client.mutate<{
      redeployWithCurrentVersion: boolean;
    }>({
      mutation: REDEPLOY_WITH_CURRENT_VERSION_MUTATION,
      variables: {
        input: {
          applicationDeploymentId
        }
      }
    });

    if (result && result.data) {
      return result.data.redeployWithCurrentVersion;
    }

    return false;
  }

  public async refreshApplicationDeployment(
    applicationDeploymentId: string
  ): Promise<boolean> {
    const result = await this.client.mutate<{
      refreshApplicationDeployment: string;
    }>({
      mutation: REFRESH_APPLICATION_DEPLOYMENT_MUTATION,
      variables: {
        input: {
          applicationDeploymentId
        }
      }
    });

    if (result && result.data) {
      return true;
    } else {
      return false;
    }
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

  public async findUserAndAffiliations(): Promise<IUserAndAffiliations> {
    const result = await this.client.query<IUserAffiliationsQuery>({
      query: USER_AFFILIATIONS_QUERY
    });

    if (!result) {
      return {
        affiliations: [],
        user: '',
        id: ''
      };
    }

    return {
      affiliations: result.data.affiliations.edges.map(edge => edge.node.name),
      user: formatName(result.data.currentUser.name),
      id: result.data.currentUser.id
    };
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
