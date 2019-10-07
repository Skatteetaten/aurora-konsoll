export const normalizeRawDeploymentSpec = (node: any) => (
  acc: any,
  key: string
): IDeploymentSpec => {
  const currentNode = node[key];
  const children = Object.keys(currentNode).filter(
    cKey => ['sources', 'source', 'value'].indexOf(cKey) === -1
  );

  const nextValue =
    children.length > 0
      ? children.reduce(
          normalizeRawDeploymentSpec(currentNode),
          {} as IDeploymentSpec
        )
      : currentNode.value;

  return {
    ...acc,
    [key]: nextValue
  };
};

export interface IDeploymentSpec {
  affiliation: string;
  alarm: boolean;
  applicationDeploymentRef: string;
  applicationId: string;
  applicationPlatform: string;
  artifactId: string;
  certificate: boolean;
  cluster: string;
  config: {
    [key: string]: string;
  };
  configVersion: string;
  database: boolean;
  debug: boolean;
  deployStrategy: IDeployStrategy;
  envName: string;
  groupId: string;
  liveness: ILiveness;
  management?: IManagement;
  mounts: {
    [key: string]: IMount;
  };
  name: string;
  pause: boolean;
  permissions: IPermissions;
  prometheus: IPrometheus;
  readiness: IReadiness;
  replicas: number;
  resources: IResources;
  route: {
    [key: string]: string;
  };
  routeDefaults: IRouteDefaults;
  schemaVersion: string;
  secretVault: string;
  serviceAccount: string;
  splunkIndex: string;
  toxiproxy: IToxiproxy;
  type: string;
  version: string;
  releaseTo?: string;
  webseal: boolean;
}

interface IDeployStrategy {
  timeout: number;
  type: string;
}

interface ILiveness {
  delay: number;
  port: number;
  timeout: number;
}

export interface IManagement {
  path: string;
  port: string;
}

export interface IMount {
  exist: boolean;
  mountName: string;
  path: string;
  type: string;
  volumeName: string;
}

interface IPermissions {
  admin: string;
}

interface IPrometheus {
  path: string;
  port: number;
}

interface IReadiness {
  delay: number;
  port: number;
  timeout: number;
}

interface ICpu {
  max: string;
  min: string;
}

interface IMemory {
  max: string;
  min: string;
}

interface IResources {
  cpu: ICpu;
  memory: IMemory;
}

interface IRouteDefaults {
  host: string;
}

interface IToxiproxy {
  version: string;
}
