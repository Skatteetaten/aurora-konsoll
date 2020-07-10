import {
  ApplicationDeploymentClient,
  CertificateClient,
  DatabaseClient,
  ImageRepositoryClient,
  NetdebugClient,
  UserSettingsClient,
  WebsealClient
} from 'services/auroraApiClients';
export interface IApiClients {
  applicationDeploymentClient: ApplicationDeploymentClient;
  imageRepositoryClient: ImageRepositoryClient;
  netdebugClient: NetdebugClient;
  userSettingsClient: UserSettingsClient;
  databaseClient: DatabaseClient;
  websealClient: WebsealClient;
  certificateClient: CertificateClient;
}
