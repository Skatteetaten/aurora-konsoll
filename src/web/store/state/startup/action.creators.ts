import { actions } from './actions';
import { doAsyncActions } from 'web/utils/redux/action-utils';

export function requestCurrentUser() {
  return doAsyncActions(actions.fetchCurrentUser, (clients) =>
    clients.applicationDeploymentClient.findUserAndAffiliations()
  );
}
