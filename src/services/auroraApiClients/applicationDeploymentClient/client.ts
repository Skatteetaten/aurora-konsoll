import ApolloClient from 'apollo-boost';

import { tokenStore } from 'services/TokenStore';

import { ITag } from '../imageRepositoryClient/client';
import { IDeploymentSpec } from './DeploymentSpec';
import {
  REDEPLOY_WITH_VERSION_MUTATION,
  REFRESH_APPLICATION_DEPLOYMENT_MUTATION
} from './mutation';
import {
  APPLICATIONS_QUERY,
  IApplicationDeploymentQuery,
  IApplications,
  IImageRepository,
  IPodResource,
  IUserAffiliationsQuery,
  USER_AFFILIATIONS_QUERY
} from './query';

const normalizeSpec = (node: any) => (
  acc: any,
  key: string
): IDeploymentSpec => {
  const currentNode = node[key];

  const children = Object.keys(currentNode).filter(
    cKey => ['sources', 'source', 'value'].indexOf(cKey) === -1
  );

  const nextValue =
    children.length > 0
      ? children.reduce(normalizeSpec(currentNode), {})
      : currentNode.value;

  return {
    ...acc,
    [key]: nextValue
  };
};

export interface IApplicationDeployment {
  id: string;
  affiliation: string;
  name: string;
  environment: string;
  statusCode: string;
  version: {
    auroraVersion: string;
    deployTag: ITag;
  };
  time: string;
  repository: string;
  pods: IPodResource[];
}

export interface IUserAndAffiliations {
  affiliations: string[];
  user: string;
}

export interface IApplicationDeploymentClient {
  findUserAndAffiliations: () => Promise<IUserAndAffiliations>;
  findAllApplicationDeployments: (
    affiliations: string[]
  ) => Promise<IApplicationDeployment[]>;
  findDeploymentSpec: (env: string, name: string) => Promise<IDeploymentSpec>;
  redeployWithVersion: (
    applicationDeploymentId: string,
    version: string
  ) => Promise<boolean>;
  refreshApplicationDeployment: (
    applicationDeploymentId: string
  ) => Promise<boolean>;
}

export class ApplicationDeploymentClient
  implements IApplicationDeploymentClient {
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

  public async findDeploymentSpec(
    env: string,
    name: string
  ): Promise<IDeploymentSpec> {
    const e = env === 'aurora' ? 'utv' : env;
    const data = await fetch(`/api/spec?ref=${e + '/' + name}`, {
      headers: [['Authorization', 'Bearer ' + tokenStore.getToken()]],
      method: 'POST'
    });

    const [spec] = await data.json();

    if (!spec) {
      return {} as IDeploymentSpec;
    }

    return Object.keys(spec).reduce(normalizeSpec(spec), {});
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
      pods: app.details.podResources,
      repository: imageRepository ? imageRepository.repository : '',
      statusCode: app.status.code,
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
