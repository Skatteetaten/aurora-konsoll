import { ActionType } from 'typesafe-actions';
import { createAsyncActions } from 'utils/redux/action-utils';
import { IGoboResult } from 'services/GoboClient';
import { IUserSettingsData } from 'services/auroraApiClients/userSettingsClient/query';

const action = (action: string) => `userSettings/${action}`;

const [
  requestUserSettings,
  requestUserSettingsSuccess,
  requestUserSettingsFailure
] = createAsyncActions<void, IGoboResult<IUserSettingsData>>(
  action('REQUEST_USER_SETTINGS')
);

const [
  requestUpdateUserSettings,
  requestUpdateUserSettingsSuccess,
  requestUpdateUserSettingsFailure
] = createAsyncActions<void, IGoboResult<{ updateUserSettings: boolean }>>(
  action('REQUEST_UPDATE_USER_SETTINGS')
);

export const actions = {
  requestUserSettings,
  requestUserSettingsSuccess,
  requestUserSettingsFailure,
  requestUpdateUserSettings,
  requestUpdateUserSettingsSuccess,
  requestUpdateUserSettingsFailure
};

export type UserSettingsAction = ActionType<typeof actions>;
