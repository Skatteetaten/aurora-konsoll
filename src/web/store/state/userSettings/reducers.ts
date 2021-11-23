import { createReducer } from '@reduxjs/toolkit';
import { IUserSettings } from 'web/models/UserSettings';

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
    requestUserSettings: [],
  },
};

export const userSettingsReducer = createReducer(initialState, (builder) => {
  builder.addCase(actions.updateUserSettingsRequest, (state) => {
    state.isLoading = true;
  });
  builder.addCase(actions.fetchUserSettings.request, (state) => {
    state.isLoading = true;
  });
  builder.addCase(actions.fetchUserSettings.success, (state, { payload }) => {
    state.isLoading = false;
    if (payload.errors) {
      state.errors.requestUserSettings.push(...payload.errors);
    }
    if (payload.data) {
      state.applicationDeploymentFilters =
        payload.data.userSettings.applicationDeploymentFilters;
    }
  });
  builder.addCase(actions.fetchUserSettings.failure, (state, { payload }) => {
    state.isLoading = false;
    state.errors.requestUserSettings.push(payload);
  });
});
