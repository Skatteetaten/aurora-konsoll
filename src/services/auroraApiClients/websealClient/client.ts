import GoboClient, { IDataAndErrors } from 'services/GoboClient';

import { IWebsealAffiliationQuery, WEBSEAL_STATES_QUERY } from './query';

export class WebsealClient {
  private client: GoboClient;

  constructor(client: GoboClient) {
    this.client = client;
  }

  public async getWebsealStates(
    affiliation: string
  ): Promise<IDataAndErrors<IWebsealAffiliationQuery>> {
    return await this.client.query<IWebsealAffiliationQuery>({
      query: WEBSEAL_STATES_QUERY,
      variables: { affiliation },
    });
  }
}
