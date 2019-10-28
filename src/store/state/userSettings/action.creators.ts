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
      actions.requestUpdateUserSettingsSuccess,
      actions.requestUpdateUserSettingsFailure
    ],
    async (clients, getState, dispatch) => {
      const result = await clients.userSettingsClient.updateUserSettings(
        userSettings
      );
      if (result.data.updateUserSettings) {
        await dispatch(getUserSettings());
      }
      return result;
    }
  );
}
