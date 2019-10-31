import { actions } from './actions';
import { doAsyncActions } from 'utils/redux/action-utils';

export function fetchApplicationDeployments(affiliations: string[]) {
  return doAsyncActions(actions.fetchApplications, clients =>
    clients.applicationDeploymentClient.findAllApplicationDeployments(
      affiliations
    )
  );
}

export function deploy(
  affiliation: string,
  applicationDeploymentId: string,
  version: string
) {
  return doAsyncActions(
    {
      request: actions.deployRequest,
      success: actions.fetchApplications.success,
      failure: actions.fetchApplications.failure
    },
    async ({ applicationDeploymentClient }) =>
      await applicationDeploymentClient.redeployWithVersionAndRefreshDeployment(
        affiliation,
        applicationDeploymentId,
        version
      )
  );
}
