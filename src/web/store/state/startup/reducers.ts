import { actions } from './actions';

import { IUserAndAffiliations } from 'web/models/ApplicationDeployment';
import { createReducer } from '@reduxjs/toolkit';

export interface IStartupState {
  isLoading: boolean;
  errors: Error[];
  currentUser: IUserAndAffiliations;
}

const initialState: IStartupState = {
  isLoading: false,
  errors: [],
  currentUser: { id: '', user: '', affiliations: [] },
};

export const startupReducer = createReducer(initialState, (builder) => {
  builder.addCase(actions.fetchCurrentUser.request, (state) => {
    state.isLoading = true;
  });
  builder.addCase(actions.fetchCurrentUser.success, (state, { payload }) => {
    state.isLoading = false;
    if (payload.data) {
      const { affiliations, currentUser } = payload.data;
      state.currentUser = {
        id: currentUser.id,
        user: formatName(currentUser.name),
        affiliations: affiliations.edges.map((edge) => edge.node.name),
      };
    }
    if (payload.errors) {
      state.errors.push(...payload.errors);
    }
  });
  builder.addCase(actions.fetchCurrentUser.failure, (state, { payload }) => {
    state.isLoading = false;
    state.errors.push(payload);
  });
});

function formatName(user: string) {
  const names = user.split(', ');
  if (names.length !== 2) {
    return user;
  }
  return names[1] + ' ' + names[0];
}
