import { ActionType } from 'typesafe-actions';
import { actions } from './actions';

import { IUserAndAffiliations } from 'models/ApplicationDeployment';
import { handleAction, reduceReducers } from 'redux-ts-utils';

export type StartupAction = ActionType<typeof actions>;

export interface IStartupState {
  readonly currentUser: IUserAndAffiliations;
}

const initialState: IStartupState = {
  currentUser: { id: '', user: '', affiliations: [] }
};

export const startupReducer = reduceReducers<IStartupState>(
  [
    handleAction(actions.fetchCurrentUserResponse, (state, { payload }) => {
      state.currentUser = payload;
    })
  ],
  initialState
);
