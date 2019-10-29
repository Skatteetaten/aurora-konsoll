import { createAsyncActions } from 'utils/redux/action-utils';
import { IDataAndErrors } from 'services/GoboClient';
import { IUserAndAffiliationsData } from 'services/auroraApiClients/applicationDeploymentClient/query';

const action = (action: string) => `currentUser/${action}`;

const [
  requestCurrentUser,
  requestCurrentUserSuccess,
  requestCurrentUserFailure
] = createAsyncActions<IDataAndErrors<IUserAndAffiliationsData>>(
  action('REQUEST_CURRENT_USER')
);

export const actions = {
  requestCurrentUser,
  requestCurrentUserSuccess,
  requestCurrentUserFailure
};
