import {
  ICertificate,
  ICertificateResult,
  ICertificatesQuery
} from 'models/certificates';
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
        certificates: this.normalizeScanStatus(result.data),
        totalCount: result.data.certificates.totalCount
      };
    }
    return {
      certificates: [],
      totalCount: 0
    };
  }

  private normalizeScanStatus(data: ICertificatesQuery): ICertificate[] {
    if (!data) {
      return [];
    }

    return data.certificates.edges.map(edge => {
      const { cn, expiresDate, id, issuedDate, revokedDate } = edge.node;
      return {
        issuedDate,
        cn,
        expiresDate,
        id,
        revokedDate
      };
    });
  }
}
