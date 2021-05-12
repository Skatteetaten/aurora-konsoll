import { ActionType } from 'typesafe-actions';
import { createAsyncActions } from 'utils/redux/action-utils';
import { IDataAndErrors } from 'services/GoboClient';
import { IUserSettingsData } from 'services/auroraApiClients/userSettingsClient/query';
import { createAction } from '@reduxjs/toolkit';

const action = (action: string) => `userSettings/${action}`;

const fetchUserSettings = createAsyncActions<IDataAndErrors<IUserSettingsData>>(
  action('FETCH_USER_SETTINGS')
);

const updateUserSettingsRequest = createAction<void>(
  action('REQUEST_UPDATE_USER_SETTINGS')
);

export const actions = {
  updateUserSettingsRequest,
  fetchUserSettings,
};

export type UserSettingsAction = ActionType<typeof actions>;
