import { actions } from './actions';
import { doAsyncActions } from 'utils/redux/action-utils';

export function fetchApplicationDeployments(affiliations: string[]) {
  return doAsyncActions(actions.fetchApplications, clients =>
    clients.applicationDeploymentClient.findAllApplicationDeployments(
      affiliations
    )
  );
}
