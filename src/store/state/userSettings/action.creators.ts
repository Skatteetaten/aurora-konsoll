import { StateThunk } from 'store/types';
import { actions } from './actions';
import { IUserSettings } from 'models/UserSettings';
import {
  addCurrentErrors,
  addErrors
} from 'screens/ErrorHandler/state/actions';

export const getUserSettings = (): StateThunk => async (
  dispatch,
  getState,
  { clients }
) => {
  const result = await clients.userSettingsClient.getUserSettings();
  dispatch(addCurrentErrors(result));

  if (result && result.data) {
    dispatch(actions.fetchUserSettings(result.data.userSettings));
  } else {
    dispatch(actions.fetchUserSettings({ applicationDeploymentFilters: [] }));
  }
};

export const updateUserSettings = (
  userSettings: IUserSettings
): StateThunk => async (dispatch, getState, { clients }) => {
  const result = await clients.userSettingsClient.updateUserSettings(
    userSettings
  );
  dispatch(addCurrentErrors(result));

  if (result && result.data) {
    dispatch(actions.fetchUserSettings(userSettings));
    dispatch(actions.isUpdatingUserSettings(result.data.updateUserSettings));
  } else {
    dispatch(addErrors([new Error('Feil ved sletting av filter')]));
    dispatch(actions.isUpdatingUserSettings(false));
  }
};
