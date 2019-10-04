import { StateThunk } from 'store/types';

import { actions } from './actions.type';

export const deploy = (
  applicationDeploymentId: string,
  version: string
): StateThunk => async (dispatch, getState, { clients }) => {
  const client = clients.applicationDeploymentClient;

  dispatch(actions.isDeploying({ inProgress: true, version }));
  const response = await client.redeployWithVersion(
    applicationDeploymentId,
    version
  );
  dispatch(actions.isDeploying({ inProgress: false, version }));

  if (response) {
    dispatch(
      actions.deployResult({
        version,
        success: response.data.redeployWithVersion
      })
    );
    if (response.errors) {
      // Dispatch error
    }
  } else {
    // Dispatch error
  }
};
