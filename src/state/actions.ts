import { ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { IAuroraApiComponentProps } from 'components/AuroraApi';

import { IUserAndAffiliations } from 'models/ApplicationDeployment';
import { addErrors } from 'models/StateManager/state/actions';
import { createAction } from 'redux-ts-utils';
import { formatName } from 'services/auroraApiClients';
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
  if (result && result.errors) {
    dispatch(addErrors(result.errors, result.name));
  }

  if (!result) {
    dispatch(
      fetchCurrentUserResponse({
        affiliations: [],
        user: '',
        id: ''
      })
    );
  } else {
    dispatch(
      fetchCurrentUserResponse({
        affiliations: result.data.affiliations.edges.map(
          edge => edge.node.name
        ),
        user: formatName(result.data.currentUser.name),
        id: result.data.currentUser.id
      })
    );
  }
};

export default {
  fetchCurrentUserResponse
};
