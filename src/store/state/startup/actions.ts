import { ActionType } from 'typesafe-actions';
import { createAsyncActions } from 'utils/redux/action-utils';
import { IDataAndErrors } from 'services/GoboClient';
import { IUserAndAffiliationsData } from 'services/auroraApiClients/applicationDeploymentClient/query';

const action = (action: string) => `currentUser/${action}`;

const fetchCurrentUser = createAsyncActions<
  IDataAndErrors<IUserAndAffiliationsData>
>(action('REQUEST_CURRENT_USER'));

export const actions = {
  fetchCurrentUser,
};

export type StartupAction = ActionType<typeof actions>;
