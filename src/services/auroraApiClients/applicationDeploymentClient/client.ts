import {
  IApplicationDeployment,
  IApplicationDeploymentDetails,
  IUserAndAffiliations
} from 'models/ApplicationDeployment';
import { normalizeRawDeploymentSpec } from 'models/DeploymentSpec';

import { IPodResource } from 'models/Pod';
import GoboClient from 'services/GoboClient';
import {
  REDEPLOY_WITH_VERSION_MUTATION,
  REFRESH_APPLICATION_DEPLOYMENT_MUTATION
} from './mutation';
import {
  APPLICATION_DEPLOYMENT_DETAILS_QUERY,
  APPLICATIONS_QUERY,
  IApplicationDeploymentDetailsQuery,
  IApplicationDeploymentQuery,
  IApplications,
  IImageRepository,
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
    if (result) {
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
    const result = await this.client.query<IApplications>({
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
      const deployments = applicationDeployments.map(deployment =>
        this.toApplicationDeployment(node.name, deployment, imageRepository)
      );
      return [...acc, ...deployments];
    }, []);
  }

  private toApplicationDeployment(
    applicationName: string,
    app: IApplicationDeploymentQuery,
    imageRepository?: IImageRepository
  ): IApplicationDeployment {
    // ! Temp fix for activemq deployments with template default version
    const getActiveMqVersion = (deployTag: string) => {
      if (applicationName === 'aurora-activemq-1.0.0' && deployTag === '') {
        return '2';
      }
      return deployTag;
    };
    return {
      affiliation: app.affiliation.name,
      environment: app.environment,
      id: app.id,
      name: app.name,
      repository: imageRepository ? imageRepository.repository : '',
      status: {
        code: app.status.code,
        comment: app.status.comment
      },
      time: app.time,
      version: {
        auroraVersion: app.version.auroraVersion,
        deployTag: {
          lastModified: '',
          name: getActiveMqVersion(app.version.deployTag.name),
          type: app.version.deployTag.type
        }
      }
    };
  }
}
