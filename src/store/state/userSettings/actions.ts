import { ActionType } from 'typesafe-actions';
import { createAsyncActions } from 'utils/redux/action-utils';
import { IDataAndErrors } from 'services/GoboClient';
import { IUserSettingsData } from 'services/auroraApiClients/userSettingsClient/query';
import { createAction } from 'redux-ts-utils';

const action = (action: string) => `userSettings/${action}`;

const [
  requestUserSettings,
  requestUserSettingsSuccess,
  requestUserSettingsFailure
] = createAsyncActions<IDataAndErrors<IUserSettingsData>>(
  action('REQUEST_USER_SETTINGS')
);

const requestUpdateUserSettings = createAction<void>(
  action('REQUEST_UPDATE_USER_SETTINGS')
);

export const actions = {
  requestUpdateUserSettings,
  requestUserSettings,
  requestUserSettingsSuccess,
  requestUserSettingsFailure
};

export type UserSettingsAction = ActionType<typeof actions>;
