import GoboClient from 'services/GoboClient';
import { IUserSettings, USERSETTINGS_QUERY } from './query';

export class UserSettingsClient {
  private client: GoboClient;

  constructor(client: GoboClient) {
    this.client = client;
  }

  public async getUserSettings(): Promise<IUserSettings> {
    const result = await this.client.query<IUserSettings>({
      query: USERSETTINGS_QUERY
    });

    if (result && result.data) {
      return result.data;
    }

    return { userSettings: { applicationDeploymentFilters: [] } };
  }
}
