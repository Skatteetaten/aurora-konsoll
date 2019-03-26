import GoboClient from 'services/GoboClient';
import { CERTIFICATES_QUERY, ICertificatesQuery } from './query';

export class CertificateClient {
  public defaultCertificates: ICertificatesQuery = {
    certificates: {
      totalCount: 0,
      edges: []
    }
  };

  public client: GoboClient;

  constructor(client: GoboClient) {
    this.client = client;
  }
  public async getCertificates(): Promise<ICertificatesQuery> {
    const result = await this.client.query<ICertificatesQuery>({
      query: CERTIFICATES_QUERY
    });
    if (!result) {
      return this.defaultCertificates;
    }

    return result.data;
  }
}
