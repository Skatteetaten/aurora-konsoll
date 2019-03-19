import { ActionType } from 'typesafe-actions';
import actions, { fetchCurrentUserResponse } from './actions';

import { IUserAndAffiliations } from 'models/ApplicationDeployment';
import { handleAction, reduceReducers } from 'redux-ts-utils';

export type StartupAction = ActionType<typeof actions>;

export interface IStartupState {
  readonly currentUser: IUserAndAffiliations;
}

export const startupReducer = reduceReducers<IStartupState>(
  [
    handleAction(fetchCurrentUserResponse, (state, { payload }) => {
      return { currentUser: payload };
    })
  ],
  { currentUser: { id: '', user: '', affiliations: [] } }
);
