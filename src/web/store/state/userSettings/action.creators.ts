import { actions } from './actions';
import { IUserSettings } from 'web/models/UserSettings';
import { doAsyncActions } from 'web/utils//redux/action-utils';

export function getUserSettings() {
  return doAsyncActions(actions.fetchUserSettings, (clients) =>
    clients.userSettingsClient.getUserSettings()
  );
}

export function updateUserSettings(userSettings: IUserSettings) {
  return doAsyncActions(
    {
      request: actions.updateUserSettingsRequest,
      success: actions.fetchUserSettings.success,
      failure: actions.fetchUserSettings.failure,
    },
    (clients) => clients.userSettingsClient.updateUserSettings(userSettings)
  );
}
