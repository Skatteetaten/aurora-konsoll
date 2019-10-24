import { IUserSettings } from 'models/UserSettings';
import { reduceReducers, handleAction } from 'redux-ts-utils';

import { actions } from './actions';

interface IUserSettingsState extends IUserSettings {
  isUpdating: boolean;
}

const initialState: IUserSettingsState = {
  isUpdating: false,
  applicationDeploymentFilters: []
};

export const userSettingsReducer = reduceReducers<IUserSettingsState>(
  [
    handleAction(actions.isUpdatingUserSettings, (state, { payload }) => {
      state.isUpdating = payload;
    }),
    handleAction(actions.fetchUserSettings, (state, { payload }) => {
      state.applicationDeploymentFilters = payload.applicationDeploymentFilters;
    })
  ],
  initialState
);
