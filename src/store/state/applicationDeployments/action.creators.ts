import { actions } from './actions';
import { doAsyncActions } from 'utils/redux/action-utils';
import { AsyncAction } from 'store/types';

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
    async ({ applicationDeploymentClient }) =>
      await applicationDeploymentClient.redeployWithVersionAndRefreshDeployment(
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
    async ({ applicationDeploymentClient }) =>
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
