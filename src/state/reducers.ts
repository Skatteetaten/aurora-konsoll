import { ActionType } from 'typesafe-actions';
import actions, {
  fetchCurrentUserResponse,
  fetchGoboUsersResponse
} from './actions';

import { IUserAndAffiliations } from 'models/ApplicationDeployment';
import { handleAction, reduceReducers } from 'redux-ts-utils';
import { IGoboUser } from 'services/auroraApiClients/goboUsageClient/query';

export type StartupAction = ActionType<typeof actions>;

export interface IStartupState {
  readonly currentUser: IUserAndAffiliations;
  readonly goboUsers: IGoboUser[];
}

function updateStateWithPayload(name: string) {
  return (state: IStartupState, { payload }: StartupAction) => {
    state[name] = payload;
  };
}

const initialState: IStartupState = {
  currentUser: { id: '', user: '', affiliations: [] },
  goboUsers: []
};

export const startupReducer = reduceReducers<IStartupState>(
  [
    handleAction(
      fetchCurrentUserResponse,
      updateStateWithPayload('currentUser')
    ),
    handleAction(fetchGoboUsersResponse, updateStateWithPayload('goboUsers'))
  ],
  initialState
);
