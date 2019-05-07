import GoboClient, { IGoboResult } from 'services/GoboClient';

import { IWebsealAffiliationQuery, WEBSEAL_STATES_QUERY } from './query';

export class WebsealClient {
  private client: GoboClient;

  constructor(client: GoboClient) {
    this.client = client;
  }

  public async getWebsealStates(
    affiliation: string
  ): Promise<IGoboResult<IWebsealAffiliationQuery> | undefined> {
    return await this.client.query<IWebsealAffiliationQuery>({
      query: WEBSEAL_STATES_QUERY,
      variables: { affiliation }
    });
  }
}
