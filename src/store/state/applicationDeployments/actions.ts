import { createAction } from 'redux-ts-utils';
import { ActionType } from 'typesafe-actions';

import { IApplicationDeploymentDetails } from 'models/ApplicationDeployment';
import { IApplicationsConnectionData } from 'services/auroraApiClients/applicationDeploymentClient/query';
import { IDataAndErrors } from 'services/GoboClient';
import { createAsyncActions } from 'utils/redux/action-utils';

const action = (action: string) => `applicationDeployments/${action}`;

const [
  requestApplications,
  requestApplicationsSuccess,
  requestApplicationsFailure
] = createAsyncActions<IDataAndErrors<IApplicationsConnectionData>>(
  action('REQUEST_APPLICATIONS')
);

const [
  requestApplicationDeploymentDetails,
  requestApplicationDeploymentDetailsSuccess,
  requestApplicationDeploymentDetailsFailure
] = createAsyncActions<IApplicationDeploymentDetails[]>(
  action('REQUEST_APPLICATION_DEPLOYMENT_DETAILS')
);

const [
  requestRefreshApplicationDeployment,
  requestRefreshApplicationDeploymentSuccess,
  requestRefreshApplicationDeploymentFailure
] = createAsyncActions<boolean>(
  action('REQUEST_REFRESH_APPLICATION_DEPLOYMENT')
);

const [
  requestUpdateCacheForAllApplications,
  requestUpdateCacheForAllApplicationsSuccess,
  requestUpdateCacheForAllApplicationsFailure
] = createAsyncActions<IDataAndErrors<{ affiliations: string[] }>>(
  action('REQUEST_UPDATE_CACHE_FOR_ALL_APPLICATIONS')
);

const deleteApplicationDeploymentResponse = createAction<boolean>(
  action('DELETE_APPLICATION_DEPLOYMENT_RESPONSE')
);

export const actions = {
  requestApplications,
  requestApplicationsSuccess,
  requestApplicationsFailure,
  requestApplicationDeploymentDetails,
  requestApplicationDeploymentDetailsSuccess,
  requestApplicationDeploymentDetailsFailure,
  requestRefreshApplicationDeployment,
  requestRefreshApplicationDeploymentSuccess,
  requestRefreshApplicationDeploymentFailure,
  requestUpdateCacheForAllApplications,
  requestUpdateCacheForAllApplicationsSuccess,
  requestUpdateCacheForAllApplicationsFailure,
  deleteApplicationDeploymentResponse
};

export type ApplicationsAction = ActionType<typeof actions>;
