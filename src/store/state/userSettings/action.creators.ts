import { actions } from './actions';
import { IUserSettings } from 'models/UserSettings';
import { doAsyncActions } from 'utils/redux/action-utils';

export function getUserSettings() {
  return doAsyncActions(
    [
      actions.requestUserSettings,
      actions.requestUserSettingsSuccess,
      actions.requestUserSettingsFailure
    ],
    async clients => await clients.userSettingsClient.getUserSettings()
  );
}

export function updateUserSettings(userSettings: IUserSettings) {
  return doAsyncActions(
    [
      actions.requestUpdateUserSettings,
      actions.requestUserSettingsSuccess,
      actions.requestUserSettingsFailure
    ],
    async clients =>
      await clients.userSettingsClient.updateUserSettings(userSettings)
  );
}
