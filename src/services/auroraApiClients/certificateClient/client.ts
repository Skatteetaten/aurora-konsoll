import { ICertificateResult, ICertificatesQuery } from 'models/certificates';
import GoboClient from 'services/GoboClient';
import { CERTIFICATES_QUERY } from './query';

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
  public async getCertificates(): Promise<ICertificateResult> {
    const result = await this.client.query<ICertificatesQuery>({
      query: CERTIFICATES_QUERY
    });

    if (result && result.data && result.data.certificates.edges.length > 0) {
      return {
        certificates: result.data.certificates.edges.map(edge => edge.node),
        totalCount: result.data.certificates.totalCount
      };
    }
    return {
      certificates: [],
      totalCount: 0
    };
  }
}
