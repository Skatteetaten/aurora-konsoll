import { IUserAndAffiliations } from 'models/ApplicationDeployment';
import { createAction } from 'redux-ts-utils';

const action = (action: string) => `currentUser/${action}`;

const fetchCurrentUserResponse = createAction<IUserAndAffiliations>(
  action('FETCHED_CURRENT_USER')
);

export const actions = {
  fetchCurrentUserResponse
};
