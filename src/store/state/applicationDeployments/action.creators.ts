import { actions } from './actions';
import { doAsyncActions } from 'utils/redux/action-utils';
import { AsyncAction } from 'store/types';

export function deleteAndRefreshApplications(
  affiliation: string,
  namespace: string,
  name: string
) {
  return doAsyncActions(
    {
      request: actions.deleteApplicationDeploymentRequest,
      success: actions.fetchApplications.success,
      failure: actions.fetchApplications.failure
    },
    clients =>
      clients.applicationDeploymentClient.deleteAndRefreshApplications(
        affiliation,
        namespace,
        name
      )
  );
}

export function refreshAllDeploymentsForAffiliation(affiliation: string) {
  return doAsyncActions(
    {
      request: actions.refreshAllDeploymentsForAffiliation,
      success: actions.fetchApplications.success,
      failure: actions.fetchApplications.failure
    },
    clients =>
      clients.applicationDeploymentClient.refreshAndFetchApplications([
        affiliation
      ])
  );
}

export function refreshApplicationDeployment(applicationDeploymentId: string) {
  return doAsyncActions(
    {
      request: actions.refreshApplicationDeployment,
      success: actions.fetchApplicationDeploymentWithDetails.success,
      failure: actions.fetchApplicationDeploymentWithDetails.failure
    },
    ({ applicationDeploymentClient }) =>
      applicationDeploymentClient.refreshAndFetchApplicationDeployment(
        applicationDeploymentId
      )
  );
}

export function fetchApplicationDeployments(affiliations: string[]) {
  return doAsyncActions(actions.fetchApplications, clients =>
    clients.applicationDeploymentClient.findAllApplicationDeployments(
      affiliations
    )
  );
}

export function deploy(applicationDeploymentId: string, version: string) {
  return doAsyncActions(
    {
      request: actions.deployRequest,
      success: actions.fetchApplicationDeploymentWithDetails.success,
      failure: actions.fetchApplicationDeploymentWithDetails.failure
    },
    ({ applicationDeploymentClient }) =>
      applicationDeploymentClient.redeployWithVersionAndRefreshDeployment(
        applicationDeploymentId,
        version
      )
  );
}

export function fetchApplicationDeploymentWithDetails(
  applicationDeploymentId: string
) {
  return doAsyncActions(
    actions.fetchApplicationDeploymentWithDetails,
    ({ applicationDeploymentClient }) =>
      applicationDeploymentClient.fetchApplicationDeploymentWithDetails(
        applicationDeploymentId
      )
  );
}

export function resetApplicationDeploymentState(): AsyncAction {
  return dispatch => {
    dispatch(actions.resetApplicationDeploymentState());
  };
}
