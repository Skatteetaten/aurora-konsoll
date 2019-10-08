import { StateThunk } from 'store/types';

import { actions } from './actions';
import { addCurrentErrors } from 'screens/ErrorHandler/state/actions';
import { refreshApplicationDeployment } from 'screens/AffiliationViews/state/actions';

export const deploy = (
  affiliation: string,
  applicationDeploymentId: string,
  version: string
): StateThunk => async (dispatch, getState, { clients }) => {
  const client = clients.applicationDeploymentClient;

  dispatch(actions.isDeploying({ inProgress: true, version }));
  const response = await client.redeployWithVersion(
    applicationDeploymentId,
    version
  );
  dispatch(addCurrentErrors(response));
  dispatch(actions.isDeploying({ inProgress: false, version }));

  if (response) {
    dispatch(
      refreshApplicationDeployment(applicationDeploymentId, affiliation)
    );
    dispatch(
      actions.deployResult({
        version,
        success: response.data.redeployWithVersion
      })
    );
  }
};
