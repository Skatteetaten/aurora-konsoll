import GoboClient from 'services/GoboClient';

import { IWebsealState } from 'models/Webseal';
import {
  IWebsealAffiliationQuery,
  IWebsealStateEdge,
  WEBSEAL_STATES_QUERY
} from './query';

export class WebsealClient {
  private client: GoboClient;

  constructor(client: GoboClient) {
    this.client = client;
  }

  public async getWebsealStates(affiliation: string): Promise<IWebsealState[]> {
    const result = await this.client.query<IWebsealAffiliationQuery>({
      query: WEBSEAL_STATES_QUERY,
      variables: { affiliation }
    });
    if (result && result.data && result.data.affiliations.edges.length > 0) {
      return this.normalizeWebsealState(result.data.affiliations.edges);
    }

    return [];
  }

  private normalizeWebsealState(edges: IWebsealStateEdge[]): IWebsealState[] {
    let states: IWebsealState[] = [];

    for (const edge of edges) {
      states = edge.node.websealStates;
    }

    return states;
  }
}
