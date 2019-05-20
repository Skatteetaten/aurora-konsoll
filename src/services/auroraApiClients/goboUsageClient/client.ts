import GoboClient, { IGoboResult } from 'services/GoboClient';
import { GOBO_USERS_USAGE_QUERY, IGoboUsage } from './query';

export class GoboUsageClient {
  private client: GoboClient;

  constructor(client: GoboClient) {
    this.client = client;
  }

  public async getGoboUsers(): Promise<IGoboResult<IGoboUsage> | undefined> {
    return await this.client.query<IGoboUsage>({
      query: GOBO_USERS_USAGE_QUERY
    });
  }
}
