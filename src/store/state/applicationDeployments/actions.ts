import { ActionType } from 'typesafe-actions';

import { IApplicationsConnectionData } from 'services/auroraApiClients/applicationDeploymentClient/query';
import { IDataAndErrors } from 'services/GoboClient';
import { createAsyncActions } from 'utils/redux/action-utils';
import { createAction } from 'redux-ts-utils';

const action = (action: string) => `applicationDeployments/${action}`;

const fetchApplications = createAsyncActions<
  IDataAndErrors<IApplicationsConnectionData>
>(action('REQUEST_APPLICATIONS'));

const deployRequest = createAction<void>(action('DEPLOY_REQUEST'));

export const actions = {
  deployRequest,
  fetchApplications
};

export type ApplicationsAction = ActionType<typeof actions>;
