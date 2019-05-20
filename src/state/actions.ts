import { ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { IAuroraApiComponentProps } from 'components/AuroraApi';

import { IUserAndAffiliations } from 'models/ApplicationDeployment';
import { addErrors } from 'models/StateManager/state/actions';
import { createAction } from 'redux-ts-utils';
import { formatName } from 'services/auroraApiClients';
import { RootAction, RootState } from 'store/types';
import { IGoboUser } from 'services/auroraApiClients/goboUsageClient/query';

const currentUserAction = (action: string) => `currentUser/${action}`;

export const fetchCurrentUserResponse = createAction<IUserAndAffiliations>(
  currentUserAction('FETCHED_CURRENT_USER')
);

export const fetchGoboUsersResponse = createAction<IGoboUser[]>(
  currentUserAction('FETCHED_GOBO_USERS')
);

export type Thunk = ActionCreator<
  ThunkAction<void, RootState, IAuroraApiComponentProps, RootAction>
>;

export const getCurrentUser: Thunk = () => async (
  dispatch,
  getState,
  { clients }
): Promise<void> => {
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

export const getGoboUsers: Thunk = () => async (
  dispatch,
  getState,
  { clients }
): Promise<void> => {
  const result = await clients.goboUsageClient.getGoboUsers();
  if (result && result.errors) {
    dispatch(addErrors(result.errors, result.name));
  }

  if (!result) {
    dispatch(fetchGoboUsersResponse([]));
  } else {
    dispatch(fetchGoboUsersResponse(result.data.gobo.usage.users));
  }
};

export default {
  fetchCurrentUserResponse,
  fetchGoboUsersResponse
};
