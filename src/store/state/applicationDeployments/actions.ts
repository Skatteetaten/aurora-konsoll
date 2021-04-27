import { ActionType } from 'typesafe-actions';

import {
  IApplicationsConnectionData,
  IApplicationDeploymentWithDetailsData,
} from 'services/auroraApiClients/applicationDeploymentClient/query';
import { IDataAndErrors } from 'services/GoboClient';
import { createAsyncActions } from 'utils/redux/action-utils';
import { createAction } from 'redux-ts-utils';
import { ApplicationDeployment } from 'models/immer/ApplicationDeployment';

const action = (action: string) => `applicationDeployments/${action}`;

const fetchApplicationDeployments = createAsyncActions<
  IDataAndErrors<IApplicationsConnectionData>
>(action('REQUEST_APPLICATIONS'));

const fetchApplicationDeploymentWithDetails = createAsyncActions<
  IDataAndErrors<IApplicationDeploymentWithDetailsData>
>(action('REQUEST_APPLICATION_DEPLOYMENT_WITH_DETAILS'));

const refreshApplicationDeployment = createAction<void>(
  action('REQUEST_REFRESH_APPLICATION_DEPLOYMENT')
);

const refreshAllDeploymentsForAffiliation = createAction<void>(
  action('REQUEST_REFRESH_DEPLOYMENT_FOR_AFFILIATION')
);

const deployRequest = createAction<void>(action('DEPLOY_REQUEST'));

const resetApplicationDeploymentState = createAction<void>(
  action('RESET_APPLICATION_DEPLOYMENT_STATE')
);

const deleteApplicationDeploymentRequest = createAction<void>(
  action('DELETE_APPLICATION_DEPLOYMENT_REQUEST')
);

const setApplicationDeployment = createAction<ApplicationDeployment>(
  action('SET_APPLICATION_DEPLOYMENT')
);

export const actions = {
  deployRequest,
  fetchApplicationDeployments,
  refreshAllDeploymentsForAffiliation,
  fetchApplicationDeploymentWithDetails,
  resetApplicationDeploymentState,
  refreshApplicationDeployment,
  deleteApplicationDeploymentRequest,
  setApplicationDeployment,
};

export type ApplicationsAction = ActionType<typeof actions>;
