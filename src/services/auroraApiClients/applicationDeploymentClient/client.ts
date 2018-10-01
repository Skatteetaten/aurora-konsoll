import ApolloClient from 'apollo-boost';

import {
  IApplicationDeployment,
  IApplicationDeploymentDetails,
  IUserAndAffiliations
} from 'models/ApplicationDeployment';
import { normalizeRawDeploymentSpec } from 'models/DeploymentSpec';

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

export class ApplicationDeploymentClient {
  private client: ApolloClient<{}>;

  constructor(client: ApolloClient<{}>) {
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

    if (!result.data) {
      return false;
    }

    return result.data.redeployWithVersion;
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

    if (result.data) {
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

    const {
      current
    } = result.data.applicationDeploymentDetails.deploymentSpecs;

    let deploymentSpec;
    if (current) {
      const spec = JSON.parse(current.jsonRepresentation);

      deploymentSpec = Object.keys(spec).reduce(
      normalizeRawDeploymentSpec(spec),
      {}
    );
    }

    return {
      deploymentSpec,
      pods: result.data.applicationDeploymentDetails.podResources
    };
  }

  public async findUserAndAffiliations(): Promise<IUserAndAffiliations> {
    const result = await this.client.query<IUserAffiliationsQuery>({
      query: USER_AFFILIATIONS_QUERY
    });

    return {
      affiliations: result.data.affiliations.edges.map(edge => edge.node.name),
      user: result.data.currentUser.name
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

    return result.data.applications.edges.reduce((acc, { node }) => {
      const { applicationDeployments, imageRepository } = node;
      const apps = applicationDeployments.map(app =>
        this.toApplicationDeployment(app, imageRepository)
      );
      return [...acc, ...apps];
    }, []);
  }

  private toApplicationDeployment(
    app: IApplicationDeploymentQuery,
    imageRepository?: IImageRepository
  ): IApplicationDeployment {
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
          name: app.version.deployTag.name,
          type: app.version.deployTag.type
        }
      }
    };
  }
}
