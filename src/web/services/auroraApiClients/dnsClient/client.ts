import GoboClient, { IDataAndErrors } from 'web/services/GoboClient';
import { CnameQuery, CNAME_QUERY } from './query';

export class DnsClient {
  private client: GoboClient;

  constructor(client: GoboClient) {
    this.client = client;
  }

  public async fetchCname(
    affiliation: string
  ): Promise<IDataAndErrors<CnameQuery>> {
    return await this.client.query<CnameQuery>({
      query: CNAME_QUERY,
      variables: {
        affiliation,
      },
    });
  }
}
