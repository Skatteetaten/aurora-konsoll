import { IUserSettings } from 'web/models/UserSettings';
import GoboClient, { IDataAndErrors } from 'web/services/GoboClient';
import { UPDATE_USERSETTINGS_MUTATION } from './mutation';
import { IUserSettingsData, USERSETTINGS_QUERY } from './query';

export class UserSettingsClient {
  private client: GoboClient;

  constructor(client: GoboClient) {
    this.client = client;
  }

  public async getUserSettings(): Promise<IDataAndErrors<IUserSettingsData>> {
    return await this.client.query<IUserSettingsData>({
      query: USERSETTINGS_QUERY,
    });
  }

  public async updateUserSettings(
    userSettings: IUserSettings
  ): Promise<IDataAndErrors<IUserSettingsData>> {
    const result = await this.client.mutate<{
      updateUserSettings: boolean;
    }>({
      mutation: UPDATE_USERSETTINGS_MUTATION,
      variables: {
        input: userSettings,
      },
    });

    if (result.data && result.data.updateUserSettings) {
      return await this.getUserSettings();
    } else {
      return {
        name: result.name,
        errors: result.errors,
      };
    }
  }
}
