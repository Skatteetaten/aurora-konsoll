import { IUserSettings } from 'models/UserSettings';
import { reduceReducers, handleAction } from 'redux-ts-utils';

import { actions } from './actions';

interface IUserSettingsState extends IUserSettings {
  isUpdating: boolean;
  isFetching: boolean;
  errors: {
    requestUserSettings: Error[];
    requestUpdateUserSettings: Error[];
  };
}

const initialState: IUserSettingsState = {
  isUpdating: false,
  isFetching: false,
  applicationDeploymentFilters: [],
  errors: {
    requestUserSettings: [],
    requestUpdateUserSettings: []
  }
};

export const userSettingsReducer = reduceReducers<IUserSettingsState>(
  [
    handleAction(actions.requestUpdateUserSettings, state => {
      state.isUpdating = true;
    }),
    handleAction(
      actions.requestUpdateUserSettingsSuccess,
      (state, { payload }) => {
        state.isUpdating = false;
        if (!payload.data.updateUserSettings) {
          state.errors.requestUpdateUserSettings.push(
            new Error('Kunne ikke oppdatere user settings.')
          );
        }
      }
    ),
    handleAction(
      actions.requestUpdateUserSettingsFailure,
      (state, { payload }) => {
        state.isUpdating = false;
        state.errors.requestUpdateUserSettings.push(...payload);
      }
    ),

    handleAction(actions.requestUserSettings, state => {
      state.isFetching = true;
    }),
    handleAction(actions.requestUserSettingsSuccess, (state, { payload }) => {
      state.isFetching = false;
      if (payload.errors) {
        state.errors.requestUserSettings.push(...payload.errors);
      }
      state.applicationDeploymentFilters =
        payload.data.userSettings.applicationDeploymentFilters;
    }),
    handleAction(actions.requestUserSettingsFailure, (state, { payload }) => {
      state.isFetching = false;
      state.errors.requestUserSettings.push(...payload);
    })
  ],
  initialState
);
