import { Azure, OnPrem } from 'web/services/auroraApiClients/dnsClient/query';
import { actions } from './actions';
import { createReducer } from '@reduxjs/toolkit';

interface IDnsState {
  isFetching: boolean;
  azure: Azure[];
  onPrem: OnPrem[];
  errors: Error[];
}

const initialState: IDnsState = {
  isFetching: false,
  azure: [],
  onPrem: [],
  errors: [],
};

export const dnsReducer = createReducer(initialState, (builder) => {
  builder.addCase(actions.fetchCnameRequest.request, (state) => {
    state.isFetching = true;
  });
  builder.addCase(actions.fetchCnameRequest.success, (state, { payload }) => {
    state.isFetching = false;
    if (payload.data && payload.data.affiliations.edges[0]) {
      state.azure = payload.data.affiliations.edges[0].node.cname.azure;
      state.onPrem = payload.data.affiliations.edges[0].node.cname.onPrem;
    }
    if (payload.errors) {
      state.errors.push(...payload.errors);
    }
  });
  builder.addCase(actions.fetchCnameRequest.failure, (state, { payload }) => {
    state.isFetching = false;
    state.errors.push(payload);
  });
});
