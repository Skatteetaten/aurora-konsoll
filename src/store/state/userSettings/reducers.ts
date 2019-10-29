import { IUserSettings } from 'models/UserSettings';
import { reduceReducers, handleAction } from 'redux-ts-utils';

import { actions } from './actions';

interface IUserSettingsState extends IUserSettings {
  isLoading: boolean;
  errors: {
    requestUserSettings: Error[];
  };
}

const initialState: IUserSettingsState = {
  isLoading: false,
  applicationDeploymentFilters: [],
  errors: {
    requestUserSettings: []
  }
};

export const userSettingsReducer = reduceReducers<IUserSettingsState>(
  [
    handleAction(actions.updateUserSettingsRequest, state => {
      state.isLoading = true;
    }),
    handleAction(actions.fetchUserSettings.request, state => {
      state.isLoading = true;
    }),

    handleAction(actions.fetchUserSettings.success, (state, { payload }) => {
      state.isLoading = false;
      if (payload.errors) {
        state.errors.requestUserSettings.push(...payload.errors);
      }
      if (payload.data) {
        state.applicationDeploymentFilters =
          payload.data.userSettings.applicationDeploymentFilters;
      }
    }),
    handleAction(actions.fetchUserSettings.failure, (state, { payload }) => {
      state.isLoading = false;
      state.errors.requestUserSettings.push(payload);
    })
  ],
  initialState
);
