import { AsyncAction } from 'store/types';
import { IUserAndAffiliations } from 'models/ApplicationDeployment';
import { addCurrentErrors } from 'screens/ErrorHandler/state/actions';

import { actions } from './actions';

export function getCurrentUser(): AsyncAction<IUserAndAffiliations> {
  return () => async (dispatch, getState, { clients }) => {
    const result = await clients.applicationDeploymentClient.findUserAndAffiliations();
    dispatch(addCurrentErrors(result));

    if (!result) {
      return dispatch(
        actions.fetchCurrentUserResponse({
          affiliations: [],
          user: '',
          id: ''
        })
      );
    } else {
      return dispatch(
        actions.fetchCurrentUserResponse({
          affiliations: result.data.affiliations.edges.map(
            edge => edge.node.name
          ),
          user: formatName(result.data.currentUser.name),
          id: result.data.currentUser.id
        })
      );
    }
  };
}

function formatName(user: string) {
  const names = user.split(', ');
  if (names.length !== 2) {
    return user;
  }
  return names[1] + ' ' + names[0];
}
