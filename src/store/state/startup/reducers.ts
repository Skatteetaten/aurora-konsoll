import { ActionType } from 'typesafe-actions';
import { actions } from './actions';

import { IUserAndAffiliations } from 'models/ApplicationDeployment';
import { handleAction, reduceReducers } from 'redux-ts-utils';

export type StartupAction = ActionType<typeof actions>;

export interface IStartupState {
  isLoading: boolean;
  errors: Error[];
  currentUser: IUserAndAffiliations;
}

const initialState: IStartupState = {
  isLoading: false,
  errors: [],
  currentUser: { id: '', user: '', affiliations: [] }
};

export const startupReducer = reduceReducers<IStartupState>(
  [
    handleAction(actions.requestCurrentUser, state => {
      state.isLoading = true;
    }),
    handleAction(actions.requestCurrentUserSuccess, (state, { payload }) => {
      state.isLoading = false;
      if (payload.data) {
        const { affiliations, currentUser } = payload.data;
        state.currentUser = {
          id: currentUser.id,
          user: formatName(currentUser.name),
          affiliations: affiliations.edges.map(edge => edge.node.name)
        };
      }
      if (payload.errors) {
        state.errors.push(...payload.errors);
      }
    }),
    handleAction(actions.requestCurrentUserFailure, (state, { payload }) => {
      state.isLoading = false;
      state.errors.push(payload);
    })
  ],
  initialState
);

function formatName(user: string) {
  const names = user.split(', ');
  if (names.length !== 2) {
    return user;
  }
  return names[1] + ' ' + names[0];
}
