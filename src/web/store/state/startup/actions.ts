import { ActionType } from 'typesafe-actions';
import { createAsyncActions } from 'web/utils/redux/action-utils';
import { IDataAndErrors } from 'web/services/GoboClient';
import { IUserAndAffiliationsData } from 'web/services/auroraApiClients/applicationDeploymentClient/query';

const action = (action: string) => `currentUser/${action}`;

const fetchCurrentUser = createAsyncActions<
  IDataAndErrors<IUserAndAffiliationsData>
>(action('REQUEST_CURRENT_USER'));

export const actions = {
  fetchCurrentUser,
};

export type StartupAction = ActionType<typeof actions>;
