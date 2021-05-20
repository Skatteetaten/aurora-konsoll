import {
  ApplicationDeploymentClient,
  CertificateClient,
  DatabaseClient,
  ImageRepositoryClient,
  NetdebugClient,
  UserSettingsClient,
  WebsealClient,
} from 'services/auroraApiClients';
import { DnsClient } from 'services/auroraApiClients/dnsClient/client';
export interface IApiClients {
  applicationDeploymentClient: ApplicationDeploymentClient;
  imageRepositoryClient: ImageRepositoryClient;
  netdebugClient: NetdebugClient;
  userSettingsClient: UserSettingsClient;
  databaseClient: DatabaseClient;
  websealClient: WebsealClient;
  certificateClient: CertificateClient;
  dnsClient: DnsClient;
}
