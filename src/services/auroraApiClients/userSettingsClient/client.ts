import { IUserSettings } from 'models/UserSettings';
import GoboClient, { IGoboResult } from 'services/GoboClient';
import { UPDATE_USERSETTINGS_MUTATION } from './mutation';
import { IUserSettingsQuery, USERSETTINGS_QUERY } from './query';

export class UserSettingsClient {
  private client: GoboClient;

  constructor(client: GoboClient) {
    this.client = client;
  }

  public async getUserSettings(): Promise<
    IGoboResult<IUserSettingsQuery> | undefined
  > {
    return await this.client.query<IUserSettingsQuery>({
      query: USERSETTINGS_QUERY
    });
  }

  public async updateUserSettings(
    userSettings: IUserSettings
  ): Promise<IGoboResult<{ updateUserSettings: boolean }> | undefined> {
    return await this.client.mutate<{
      updateUserSettings: boolean;
    }>({
      mutation: UPDATE_USERSETTINGS_MUTATION,
      variables: {
        input: userSettings
      }
    });
  }
}
