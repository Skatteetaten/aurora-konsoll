import {
  ApplicationDeploymentClient,
  CertificateClient,
  DatabaseClient,
  ImageRepositoryClient,
  NetdebugClient,
  UserSettingsClient,
  WebsealClient,
  DnsClient,
  StorageGridClient,
} from 'web/services/auroraApiClients';
export interface IApiClients {
  applicationDeploymentClient: ApplicationDeploymentClient;
  imageRepositoryClient: ImageRepositoryClient;
  netdebugClient: NetdebugClient;
  userSettingsClient: UserSettingsClient;
  databaseClient: DatabaseClient;
  websealClient: WebsealClient;
  certificateClient: CertificateClient;
  dnsClient: DnsClient;
  storageGridClient: StorageGridClient;
}
