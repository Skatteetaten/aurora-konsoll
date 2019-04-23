import { errorStateManager } from 'models/StateManager/ErrorStateManager';
import GoboClient from 'services/GoboClient';
import { GOBO_USERS_USAGE_QUERY, IGoboUsage, IGoboUser } from './query';

export class GoboUsageClient {
  private client: GoboClient;

  constructor(client: GoboClient) {
    this.client = client;
  }

  public async getGoboUsers(): Promise<IGoboUser[]> {
    const result = await this.client.query<IGoboUsage>({
      query: GOBO_USERS_USAGE_QUERY
    });
    if (result && result.data) {
      return result.data.gobo.usage.users;
    }
    errorStateManager.addError(new Error(`Kunne ikke finne brukere`));
    return [];
  }
}
