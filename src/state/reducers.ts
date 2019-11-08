import { ActionType } from 'typesafe-actions';
import actions, { fetchCurrentUserResponse } from './actions';

import { IUserAndAffiliations } from 'models/ApplicationDeployment';
import { handleAction, reduceReducers } from 'redux-ts-utils';

export type StartupAction = ActionType<typeof actions>;

export interface IStartupState {
  readonly currentUser: IUserAndAffiliations;
}

function updateStateWithPayload(name: string) {
  return (state: IStartupState, { payload }: StartupAction) => {
    state[name] = payload;
  };
}

const initialState: IStartupState = {
  currentUser: { id: '', user: '', affiliations: [] }
};

export const startupReducer = reduceReducers<IStartupState>(
  [
    handleAction(
      fetchCurrentUserResponse,
      updateStateWithPayload('currentUser')
    )
  ],
  initialState
);
