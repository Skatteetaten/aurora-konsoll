import { ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { IAuroraApiComponentProps } from 'components/AuroraApi';

import { IUserAndAffiliations } from 'models/ApplicationDeployment';
import { createAction } from 'redux-ts-utils';
import { RootAction, RootState } from 'store/types';

const currentUserAction = (action: string) => `currentUser/${action}`;

export const fetchCurrentUserResponse = createAction<IUserAndAffiliations>(
  currentUserAction('FETCHED_CURRENT_USER')
);

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
