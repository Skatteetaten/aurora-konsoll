import { IUserSettings } from 'models/UserSettings';
import GraphQLClient from '../../GraphQLClient';
import { UPDATE_USERSETTINGS_MUTATION } from './mutation';
import { IUserSettingsQuery, USERSETTINGS_QUERY } from './query';

export class UserSettingsClient {
  private client: GraphQLClient;

  constructor(client: GraphQLClient) {
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

  public async updateUserSettings(userSettings: IUserSettings) {
    const result = await this.client.mutate<{
      updateUserSettings: boolean;
    }>({
      mutation: UPDATE_USERSETTINGS_MUTATION,
      variables: {
        input: userSettings
      }
    });

    if (result && result.data) {
      return result.data.updateUserSettings;
    }

    return false;
  }
}
