import { IUserAndAffiliations } from 'models/ApplicationDeployment';
import { addCurrentErrors } from 'screens/ErrorHandler/state/actions';
import { createAction } from 'redux-ts-utils';
import { IGoboUser } from 'services/auroraApiClients/goboUsageClient/query';
import { Thunk } from 'store/types';

const currentUserAction = (action: string) => `currentUser/${action}`;

export const fetchCurrentUserResponse = createAction<IUserAndAffiliations>(
  currentUserAction('FETCHED_CURRENT_USER')
);

export const fetchGoboUsersResponse = createAction<IGoboUser[]>(
  currentUserAction('FETCHED_GOBO_USERS')
);

export const getCurrentUser: Thunk = () => async (
  dispatch,
  getState,
  { clients }
): Promise<void> => {
  const result = await clients.applicationDeploymentClient.findUserAndAffiliations();
  dispatch(addCurrentErrors(result));

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
  dispatch(addCurrentErrors(result));

  if (!result) {
    dispatch(fetchGoboUsersResponse([]));
  } else {
    dispatch(fetchGoboUsersResponse(result.data.gobo.usage.users));
  }
};

function formatName(user: string) {
  const names = user.split(', ');
  if (names.length !== 2) {
    return user;
  }
  return names[1] + ' ' + names[0];
}

export default {
  fetchCurrentUserResponse,
  fetchGoboUsersResponse
};
