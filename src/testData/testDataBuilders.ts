import * as Factory from 'factory.ts';
import {
  IApplicationDeployment,
  IApplicationDeploymentDetails,
  IUserAndAffiliations
} from 'models/ApplicationDeployment';
import {
  ICertificate,
  ICertificateResult,
  ICertificateView
} from 'models/certificates';
import { IDeploymentSpec, IMount } from 'models/DeploymentSpec';
import { ImageTagType } from 'models/ImageTagType';
import { IPodResource } from 'models/Pod';
import {
  ICreateDatabaseSchemaInput,
  ICreateDatabaseSchemaResponse,
  IDatabaseSchema,
  IDatabaseSchemaInput,
  IDatabaseSchemas,
  IDatabaseSchemaView,
  IDeleteDatabaseSchemasResponse,
  IJdbcUser,
  IUpdateDatabaseSchemaInputWithCreatedBy
} from 'models/schemas';
import { StatusCode } from 'models/Status';
import { ITagsPagedGroup } from 'models/Tag';
import { IApplicationDeploymentFilters } from 'models/UserSettings';
import { IAcl, IWebsealState } from 'models/Webseal';
import { ISchemasState } from 'screens/AffiliationViews/DatabaseView/state/reducers';
import { IWebsealReduxState } from 'screens/AffiliationViews/WebsealView/state/reducers';
import { ICertificateState } from 'screens/CertificateView/state/reducers';
import { INetdebugResult } from 'services/auroraApiClients';
import { IFilter } from 'services/DeploymentFilterService';
import { IStartupState } from 'state/reducers';
import { INetdebugViewState } from 'screens/NetdebugView/state/reducer';

const mountFactory = Factory.Sync.makeFactory<IMount>({
  exist: true,
  mountName: 'name',
  path: '/',
  type: 'mount',
  volumeName: 'volume'
});

export const deploymentSpecFactory = Factory.Sync.makeFactory<IDeploymentSpec>({
  version: 'latest',
  affiliation: 'paas',
  alarm: true,
  applicationDeploymentRef: 'martin-dev/martin-test-applikasjon',
  applicationId: 'martin-dev/martin-test-applikasjon',
  applicationPlatform: 'java',
  artifactId: 'openshift-reference-springboot-server',
  certificate: true,
  cluster: 'utv',
  configVersion: 'master',
  config: { config: 'config' },
  serviceAccount: '',
  mounts: { key: mountFactory.build() },
  database: true,
  secretVault: 'secret',
  debug: false,
  deployStrategy: { type: 'rolling', timeout: 180 },
  envName: 'martin-dev',
  groupId: 'openshift',
  liveness: { port: 8080, delay: 10, timeout: 1 },
  management: { path: '', port: '8081' },
  name: 'martin-test-applikasjon',
  pause: false,
  permissions: { admin: 'test' },
  prometheus: { path: '/test', port: 8081 },
  readiness: { port: 8080, delay: 10, timeout: 1 },
  replicas: 1,
  resources: {
    cpu: {
      max: '2000m',
      min: '10m'
    },
    memory: {
      max: '512Mi',
      min: '128Mi'
    }
  },
  route: { route: 'route' },
  routeDefaults: { host: 'test' },
  schemaVersion: 'v1',
  splunkIndex: 'openshift-test',
  toxiproxy: { version: '2.1.3' },
  type: 'deploy',
  webseal: false
});

export const podFactory = Factory.Sync.makeFactory<IPodResource>({
  latestDeployTag: false,
  name: Factory.each(i => 'martin-test-applikasjon-16-rmvrd' + i),
  phase: 'Down',
  ready: true,
  restartCount: 1,
  startTime: '2018-12-04T13:05:50Z',
  links: [
    {
      name: 'app',
      url: 'localhost/app'
    }
  ]
});

export const deploymentFactory = Factory.Sync.makeFactory<
  IApplicationDeployment
>({
  id: 'c10010e594f229649437240f24f231343d62f8fa',
  affiliation: 'paas',
  environment: 'martin-dev',
  name: 'martin-test-applikasjon',
  repository: 'localhost/"martin-test-applikasjon',
  status: {
    code: StatusCode.OBSERVE,
    reasons: [],
    reports: []
  },
  time: '2018-12-07T11:48:34.230Z',
  version: {
    auroraVersion: '2.0.14-b1.17.0-flange-8.181.1',
    deployTag: {
      lastModified: '',
      name: 'latest',
      type: ImageTagType.AURORA_VERSION
    },
    releaseTo: undefined
  },
  permission: {
    paas: {
      admin: false,
      view: true
    }
  }
});

export const deploymentDetailsFactory = Factory.Sync.makeFactory<
  IApplicationDeploymentDetails
>({
  deploymentSpec: deploymentSpecFactory.build(),
  pods: podFactory.buildList(3),
  serviceLinks: []
});

export const applicationDeploymentFilterFactory = Factory.Sync.makeFactory<
  IApplicationDeploymentFilters
>({
  name: 'my-filter',
  affiliation: 'paas',
  default: true,
  applications: ['app1', 'app2'],
  environments: ['test']
});

export const filterFactory = Factory.Sync.makeFactory<IFilter>({
  applications: [],
  environments: [],
  default: true,
  name: 'auroraFilter'
});

export const databaseSchemaViewFactory = Factory.Sync.makeFactory<
  IDatabaseSchemaView
>({
  id: '123',
  application: 'application',
  environment: 'environment',
  discriminator: 'db',
  createdBy: '12345',
  createdDate: '01.12.2015',
  lastUsedDate: '23.01.2019',
  applicationDeploymentsUses: 1,
  sizeInMb: 0.75,
  type: 'MANAGED',
  jdbcUrl: 'jdbc:oracle:thin:@localhost:1521:db'
});

export const databaseSchemaFactory = Factory.Sync.makeFactory<IDatabaseSchema>({
  discriminator: 'db',
  application: 'application',
  environment: 'environment',
  description: 'description',
  createdBy: '12345',
  createdDate: new Date(2019, 0, 12),
  lastUsedDate: new Date(2019, 0, 22),
  applicationDeployments: [],
  sizeInMb: 0.75,
  type: 'MANAGED',
  affiliation: { name: 'paas' },
  databaseEngine: 'oracle',
  id: '1234.1234.1234',
  jdbcUrl: 'jdbcurl-123',
  name: 'l4342',
  users: []
});

export const tagsPagedGroupFactory = Factory.Sync.makeFactory<ITagsPagedGroup>({
  auroraSnapshotVersion: {
    tags: [
      {
        name: 'aurora-versjon-test',
        lastModified: '',
        type: ImageTagType.AURORA_SNAPSHOT_VERSION
      }
    ],
    endCursor: '',
    hasNextPage: false
  },
  auroraVersion: {
    tags: [
      {
        name: 'aurora-versjon-test',
        lastModified: '',
        type: ImageTagType.AURORA_VERSION
      }
    ],
    endCursor: '',
    hasNextPage: false
  },
  bugfix: {
    tags: [
      {
        name: '0.1.5',
        lastModified: '',
        type: ImageTagType.BUGFIX
      }
    ],
    endCursor: '',
    hasNextPage: false
  },
  commitHash: {
    tags: [],
    endCursor: '',
    hasNextPage: false
  },
  latest: {
    tags: [
      {
        name: 'latest',
        lastModified: '',
        type: ImageTagType.LATEST
      }
    ],
    endCursor: '',
    hasNextPage: false
  },
  major: {
    tags: [
      {
        name: '0',
        lastModified: '',
        type: ImageTagType.MAJOR
      }
    ],
    endCursor: '',
    hasNextPage: false
  },
  minor: {
    tags: [
      {
        name: '0.1',
        lastModified: '',
        type: ImageTagType.MINOR
      }
    ],
    endCursor: '',
    hasNextPage: false
  },
  snapshot: {
    tags: [
      {
        name: 'feature-aurora-versjon123',
        lastModified: '',
        type: ImageTagType.SNAPSHOT
      }
    ],
    endCursor: '',
    hasNextPage: false
  }
});

export const databaseSchemaInputFactory = Factory.Sync.makeFactory<
  IDatabaseSchemaInput
>({
  application: 'application',
  description: null,
  environment: 'environment',
  discriminator: 'db',
  createdBy: '12345',
  affiliation: 'paas'
});

export const databaseSchemaInputWithCreatedByFactory = Factory.Sync.makeFactory<
  IUpdateDatabaseSchemaInputWithCreatedBy
>({
  id: '1234.1234.1234',
  discriminator: 'db',
  description: 'description',
  application: 'application',
  environment: 'environment',
  affiliation: 'paas',
  createdBy: '12345'
});

export const jdbcUserFactory = Factory.Sync.makeFactory<IJdbcUser>({
  jdbcUrl: 'jdbc:oracle:thin:@test.skead.no:1521/referanse',
  password: 'password',
  username: 'username'
});

export const createDatabaseSchemaResponseFactory = Factory.Sync.makeFactory<
  ICreateDatabaseSchemaResponse
>({
  id: '123',
  jdbcUser: jdbcUserFactory.build()
});

export const certificateViewFactory = Factory.Sync.makeFactory<
  ICertificateView
>({
  id: 123,
  dn: 'test',
  issuedDate: '12.01.2018',
  revokedDate: '22.03.2016',
  expiresDate: '12.01.2019'
});

export const certificateFactory = Factory.Sync.makeFactory<ICertificate>({
  id: '123',
  dn: 'test',
  issuedDate: new Date(2018, 0, 12),
  revokedDate: new Date(2016, 2, 22),
  expiresDate: new Date(2019, 0, 12)
});

export const certificateResultFactory = Factory.Sync.makeFactory<
  ICertificateResult
>({
  certificates: [certificateFactory.build()],
  totalCount: 1
});

export const schemasFactory = Factory.Sync.makeFactory<ISchemasState>({
  isFetchingSchemas: false,
  databaseSchemas: { databaseSchemas: [] },
  updateSchemaResponse: false,
  deleteSchemasResponse: { failed: [], succeeded: [] },
  testJdbcConnectionResponse: false,
  createDatabaseSchemaResponse: {
    id: '',
    jdbcUser: { jdbcUrl: '', username: '', password: '' }
  }
});

export const certificateInitialFactory = Factory.Sync.makeFactory<
  ICertificateState
>({
  certificates: {
    certificates: [],
    totalCount: 0
  },
  isFetchingCertificates: false
});

export const databaseSchemasFactory = Factory.Sync.makeFactory<
  IDatabaseSchemas
>({
  databaseSchemas: [databaseSchemaFactory.build()]
});

export const deleteDatabaseSchemasResponseFactory = Factory.Sync.makeFactory<
  IDeleteDatabaseSchemasResponse
>({
  failed: [],
  succeeded: []
});

export const userAndAffiliationsFactory = Factory.Sync.makeFactory<
  IUserAndAffiliations
>({
  affiliations: ['paas'],
  id: '123',
  user: 'bob'
});

export const createDatabaseSchemaInputFactory = Factory.Sync.makeFactory<
  ICreateDatabaseSchemaInput
>({
  affiliation: 'paas',
  application: 'app',
  createdBy: 'd36754',
  description: null,
  discriminator: 'my-db',
  environment: 'env',
  jdbcUser: {
    jdbcUrl: 'jdbc:oracle:thin:@test.skead.no:1521/referanse',
    password: 'password',
    username: 'username'
  }
});

export const startupFactory = Factory.Sync.makeFactory<IStartupState>({
  currentUser: userAndAffiliationsFactory.build()
});

export const aclFactory = Factory.Sync.makeFactory<IAcl>({
  aclName: 'acl-name',
  anyOther: false,
  open: true,
  roles: []
});

export const netdebugResultFactory = Factory.Sync.makeFactory<INetdebugResult>({
  failed: [],
  open: [],
  status: 'CLOSED'
});

export const netdebugViewStateInitialState = Factory.Sync.makeFactory<
  INetdebugViewState
>({
  isFetching: false,
  netdebugStatus: netdebugResultFactory.build()
});

export const websealStateFactory = Factory.Sync.makeFactory<IWebsealState>({
  acl: aclFactory.build(),
  name: 'state-name',
  namespace: 'namespace',
  routeName: 'route',
  junctions: ['{"totalRequests":"10"}', '{"totalRequests":"12"}']
});

export const websealReduxStateFactory = Factory.Sync.makeFactory<
  IWebsealReduxState
>({
  isFetchingWebsealStates: false,
  websealStates: []
});
