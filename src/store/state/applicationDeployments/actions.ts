import { ActionType } from 'typesafe-actions';

import {
  IApplicationsConnectionData,
  IApplicationDeploymentWithDetailsData
} from 'services/auroraApiClients/applicationDeploymentClient/query';
import { IDataAndErrors } from 'services/GoboClient';
import { createAsyncActions } from 'utils/redux/action-utils';
import { createAction } from 'redux-ts-utils';

const action = (action: string) => `applicationDeployments/${action}`;

const fetchApplications = createAsyncActions<
  IDataAndErrors<IApplicationsConnectionData>
>(action('REQUEST_APPLICATIONS'));

const fetchApplicationDeploymentWithDetails = createAsyncActions<
  IDataAndErrors<IApplicationDeploymentWithDetailsData>
>(action('REQUEST_APPLICATION_DEPLOYMENT_WITH_DETAILS'));

const deployRequest = createAction<void>(action('DEPLOY_REQUEST'));

const resetApplicationDeploymentState = createAction<void>(
  action('RESET_APPLICATION_DEPLOYMENT_STATE')
);

export const actions = {
  deployRequest,
  fetchApplications,
  fetchApplicationDeploymentWithDetails,
  resetApplicationDeploymentState
};

export type ApplicationsAction = ActionType<typeof actions>;
