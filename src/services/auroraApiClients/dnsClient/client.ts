import GoboClient, { IDataAndErrors } from 'services/GoboClient';
import { CnameInfosQuery, CNAME_INFO_QUERY } from './query';

export class DnsClient {
  private client: GoboClient;

  constructor(client: GoboClient) {
    this.client = client;
  }

  public async fetchCnameInfos(
    affiliation: string
  ): Promise<IDataAndErrors<CnameInfosQuery>> {
    return await this.client.query<CnameInfosQuery>({
      query: CNAME_INFO_QUERY,
      variables: {
        affiliation,
      },
    });
  }
}
