import { actions } from './actions';
import { IUserSettings } from 'models/UserSettings';
import { doAsyncActions } from 'utils/redux/action-utils';

export function getUserSettings() {
  return doAsyncActions(
    actions.fetchUserSettings,
    async clients => await clients.userSettingsClient.getUserSettings()
  );
}

export function updateUserSettings(userSettings: IUserSettings) {
  return doAsyncActions(
    {
      request: actions.updateUserSettingsRequest,
      success: actions.fetchUserSettings.success,
      failure: actions.fetchUserSettings.failure
    },
    async clients =>
      await clients.userSettingsClient.updateUserSettings(userSettings)
  );
}
