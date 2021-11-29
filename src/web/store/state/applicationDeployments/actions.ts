import { ActionType } from 'typesafe-actions';

import {
  IApplicationsConnectionData,
  IApplicationDeploymentWithDetailsData,
} from 'web/services/auroraApiClients/applicationDeploymentClient/query';
import { IDataAndErrors } from 'web/services/GoboClient';
import { createAsyncActions } from 'web/utils/redux/action-utils';
import { createAction } from '@reduxjs/toolkit';

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

const setApplicationDeploymentId = createAction<string | undefined>(
  action('SET_APPLICATION_DEPLOYMENT_ID')
);

export const actions = {
  deployRequest,
  fetchApplicationDeployments,
  refreshAllDeploymentsForAffiliation,
  fetchApplicationDeploymentWithDetails,
  resetApplicationDeploymentState,
  refreshApplicationDeployment,
  deleteApplicationDeploymentRequest,
  setApplicationDeploymentId,
};

export type ApplicationsAction = ActionType<typeof actions>;
