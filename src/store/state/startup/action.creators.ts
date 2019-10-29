import { actions } from './actions';
import { doAsyncActions } from 'utils/redux/action-utils';

export function requestCurrentUser() {
  return doAsyncActions(
    [
      actions.requestCurrentUser,
      actions.requestCurrentUserSuccess,
      actions.requestCurrentUserFailure
    ],
    async clients =>
      await clients.applicationDeploymentClient.findUserAndAffiliations()
  );
}
