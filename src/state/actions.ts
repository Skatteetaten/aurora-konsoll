import { ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { action } from 'typesafe-actions';

import { IAuroraApiComponentProps } from 'components/AuroraApi';

import { IUserAndAffiliations } from 'models/ApplicationDeployment';
import { RootAction, RootState } from 'store/types';

export const FETCHED_CURRENT_USER = 'currentUser/FETCHED_CURRENT_USER';

export const fetchCurrentUserResponse = (currentUser: IUserAndAffiliations) =>
  action(FETCHED_CURRENT_USER, { currentUser });

export type Thunk = ActionCreator<
  ThunkAction<void, RootState, IAuroraApiComponentProps, RootAction>
>;

export const getCurrentUser: Thunk = () => async (
  dispatch,
  getState,
  { clients }
) => {
  const result = await clients.applicationDeploymentClient.findUserAndAffiliations();
  dispatch(fetchCurrentUserResponse(result));
};

export default {
  fetchCurrentUserResponse
};
