import { actions } from './actions';
import { doAsyncActions } from 'utils/redux/action-utils';

export function fetchApplicationDeployments(affiliations: string[]) {
  return doAsyncActions(
    [
      actions.requestApplications,
      actions.requestApplicationsSuccess,
      actions.requestApplicationsFailure
    ],
    clients =>
      clients.applicationDeploymentClient.findAllApplicationDeployments(
        affiliations
      )
  );
}

export function updateCacheForAllApplications(affiliations: string[]) {
  return doAsyncActions(
    [
      actions.requestUpdateCacheForAllApplications,
      actions.requestUpdateCacheForAllApplicationsSuccess,
      actions.requestUpdateCacheForAllApplicationsFailure
    ],
    async clients =>
      await clients.applicationDeploymentClient.refreshAffiliations(
        affiliations
      )
  );
}
