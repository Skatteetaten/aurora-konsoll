import { ICertificatesQuery } from 'web/models/certificates';
import GoboClient, { IDataAndErrors } from 'web/services/GoboClient';
import { CERTIFICATES_QUERY } from './query';

export class CertificateClient {
  public client: GoboClient;

  constructor(client: GoboClient) {
    this.client = client;
  }
  public async getCertificates(): Promise<
    IDataAndErrors<ICertificatesQuery> | undefined
  > {
    return await this.client.query<ICertificatesQuery>({
      query: CERTIFICATES_QUERY,
    });
  }
}
