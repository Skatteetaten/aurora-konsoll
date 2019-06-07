import { ICertificatesQuery } from 'models/certificates';
import GoboClient, { IGoboResult } from 'services/GoboClient';
import { CERTIFICATES_QUERY } from './query';

export class CertificateClient {
  public client: GoboClient;

  constructor(client: GoboClient) {
    this.client = client;
  }
  public async getCertificates(): Promise<
    IGoboResult<ICertificatesQuery> | undefined
  > {
    return await this.client.query<ICertificatesQuery>({
      query: CERTIFICATES_QUERY
    });
  }
}
