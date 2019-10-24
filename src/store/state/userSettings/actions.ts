import { createAction } from 'redux-ts-utils';
import { IUserSettings } from 'models/UserSettings';
import { ActionType } from 'typesafe-actions';

const action = (action: string) => `userSettings/${action}`;

const fetchUserSettings = createAction<IUserSettings>(
  action('FETCH_USER_SETTING')
);

const isUpdatingUserSettings = createAction<boolean>(
  action('IS_UPDATING_USER_SETTINGS')
);

export const actions = {
  fetchUserSettings,
  isUpdatingUserSettings
};

export type UserSettingsAction = ActionType<typeof actions>;
