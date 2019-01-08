import {
  IApplicationDeployment,
  IApplicationDeploymentDetails,
  IUserAndAffiliations
} from 'models/ApplicationDeployment';
import { normalizeRawDeploymentSpec } from 'models/DeploymentSpec';

import { IPodResource } from 'models/Pod';
import GoboClient from 'services/GoboClient';
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

  public async refreshAffiliations(affiliations: string[]): Promise<boolean> {
    const result = await this.client.mutate<{
      affiliations: string[];
    }>({
      mutation: REFRESH_APPLICATION_DEPLOYMENTS_MUTATION,
      variables: {
        input: {
          affiliations
        }
      }
    });

    if (result && result.data) {
      return true;
    } else {
      return false;
    }
  }

  public async findApplicationDeploymentDetails(
    id: string
  ): Promise<IApplicationDeploymentDetails> {
    const result = await this.client.query<IApplicationDeploymentDetailsQuery>({
      query: APPLICATION_DEPLOYMENT_DETAILS_QUERY,
      variables: {
        id
      }
    });
    let deploymentSpec;
    let pods: IPodResource[] = [];
    if (result && result.data && result.data.applicationDeploymentDetails) {
      const {
        deploymentSpecs,
        podResources
      } = result.data.applicationDeploymentDetails;

      if (deploymentSpecs.current) {
        const spec = JSON.parse(deploymentSpecs.current.jsonRepresentation);
        deploymentSpec = Object.keys(spec).reduce(
          normalizeRawDeploymentSpec(spec),
          {}
        );
      }
      pods = podResources;
    }

    return {
      deploymentSpec,
      pods
    };
  }

  public async findUserAndAffiliations(): Promise<IUserAndAffiliations> {
    const result = await this.client.query<IUserAffiliationsQuery>({
      query: USER_AFFILIATIONS_QUERY
    });

    if (!result) {
      return {
        affiliations: [],
        user: ''
      };
    }

    return {
      affiliations: result.data.affiliations.edges.map(edge => edge.node.name),
      user: formatName(result.data.currentUser.name)
    };
  }

  public async findAllApplicationDeployments(
    affiliations: string[]
  ): Promise<IApplicationDeployment[]> {
    const result = await this.client.query<IApplicationsConnectionQuery>({
      query: APPLICATIONS_QUERY,
      variables: {
        affiliations
      }
    });

    if (!result) {
      return [];
    }

    return result.data.applications.edges.reduce((acc, { node }) => {
      const { applicationDeployments, imageRepository } = node;
      const deployments = applicationDeployments.map(app => ({
        affiliation: app.affiliation.name,
        environment: app.environment,
        id: app.id,
        name: app.name,
        permission: app.namespace.permission,
        repository: imageRepository ? imageRepository.repository : '',
        status: {
          code: app.status.code,
          reasons: app.status.reasons,
          reports: app.status.reports
        },
        time: app.time,
        version: {
          releaseTo: app.version.releaseTo,
          auroraVersion: app.version.auroraVersion,
          deployTag: {
            lastModified: '',
            name: findDeployTagForTemplate(
              node.name,
              app.version.deployTag.name
            ),
            type: app.version.deployTag.type
          }
        }
      }));
      return [...acc, ...deployments];
    }, []);
  }
}

// ! Temp fix for template deployments with default version
// TODO: FIX
function findDeployTagForTemplate(applicationName: string, deployTag: string) {
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
