import { ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { IAuroraApiComponentProps } from 'components/AuroraApi';

import { addError } from 'models/StateManager/state/actions';
import { createAction } from 'redux-ts-utils';
import { RootAction, RootState } from 'store/types';

const affiliationViewAction = (action: string) => `currentUser/${action}`;

export const refreshAffiliationsResponse = createAction<boolean>(
  affiliationViewAction('REFRESH_AFFILIATIONS_RESPONSE')
);

export type Thunk = ActionCreator<
  ThunkAction<void, RootState, IAuroraApiComponentProps, RootAction>
>;

export const refreshAffiliations: Thunk = (affiliations: string[]) => async (
  dispatch,
  getState,
  { clients }
) => {
  dispatch(refreshAffiliationsResponse(true));
  const result = await clients.applicationDeploymentClient.refreshAffiliations(
    affiliations
  );
  if (result && result.errors) {
    result.errors.forEach(e => {
      const err = new Error(`${e.message} ${e.extensions}`);
      dispatch(addError(err));
    });
  }
  dispatch(refreshAffiliationsResponse(false));
};

export default {
  refreshAffiliationsResponse
};
