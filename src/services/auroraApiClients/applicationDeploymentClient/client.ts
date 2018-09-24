import ApolloClient from 'apollo-boost';
import {
  APPLICATIONS_QUERY,
  IApplicationDeploymentQuery,
  IApplications,
  IImageRepository,
  IPodResource,
  IUserAffiliationsQuery,
  USER_AFFILIATIONS_QUERY
} from './query';

import { Omit } from 'react-router';
import { tokenStore } from '../../TokenStore';
import { ITag } from '../imageRepositoryClient/client';
import { IDeploymentSpec } from './DeploymentSpec';

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
    deployTag: Omit<ITag, 'lastModified'>;
  };
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
}

export class ApplicationDeploymentClient
  implements IApplicationDeploymentClient {
  private client: ApolloClient<{}>;

  constructor(client: ApolloClient<{}>) {
    this.client = client;
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
      version: {
        auroraVersion: app.version.auroraVersion,
        deployTag: {
          name: app.version.deployTag.name,
          type: app.version.deployTag.type
        }
      }
    };
  }
}
