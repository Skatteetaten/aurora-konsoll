import { ActionType } from 'typesafe-actions';

import { IApplicationsConnectionData } from 'services/auroraApiClients/applicationDeploymentClient/query';
import { IDataAndErrors } from 'services/GoboClient';
import { createAsyncActions } from 'utils/redux/action-utils';

const action = (action: string) => `applicationDeployments/${action}`;

const fetchApplications = createAsyncActions<
  IDataAndErrors<IApplicationsConnectionData>
>(action('REQUEST_APPLICATIONS'));

export const actions = {
  fetchApplications
};

export type ApplicationsAction = ActionType<typeof actions>;
