import { IUserSettings } from 'models/UserSettings';
import GoboClient from 'services/GoboClient';
import { IUserSettingsQuery, USERSETTINGS_QUERY } from './query';

export class UserSettingsClient {
  private client: GoboClient;

  constructor(client: GoboClient) {
    this.client = client;
  }

  public async getUserSettings(): Promise<IUserSettings> {
    const result = await this.client.query<IUserSettingsQuery>({
      query: USERSETTINGS_QUERY
    });

    if (result && result.data) {
      return result.data.userSettings;
    }

    return { applicationDeploymentFilters: [] };
  }
}
