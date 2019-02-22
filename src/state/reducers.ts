import { combineReducers } from 'redux';
import { ActionType } from 'typesafe-actions';
import actions, { FETCHED_CURRENT_USER } from './actions';

import { IUserAndAffiliations } from 'models/ApplicationDeployment';

export type StartupAction = ActionType<typeof actions>;

export interface IStartupState {
  readonly currentUser: IUserAndAffiliations;
}

export const startupReducer = combineReducers<IStartupState, StartupAction>({
  currentUser: (state = { id: '', user: '', affiliations: [] }, action) => {
    switch (action.type) {
      case FETCHED_CURRENT_USER:
        return action.payload.currentUser;
      default:
        return state;
    }
  }
});
