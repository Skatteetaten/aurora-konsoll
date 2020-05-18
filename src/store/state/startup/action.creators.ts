import { actions } from './actions';
import { doAsyncActions } from 'utils/redux/action-utils';

export function requestCurrentUser() {
  return doAsyncActions(actions.fetchCurrentUser, (clients) =>
    clients.applicationDeploymentClient.findUserAndAffiliations()
  );
}
