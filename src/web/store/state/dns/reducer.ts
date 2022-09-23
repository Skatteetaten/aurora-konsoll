import { Azure, OnPrem } from 'web/services/auroraApiClients/dnsClient/query';
import { actions } from './actions';
import { createReducer } from '@reduxjs/toolkit';

export interface OnPremData extends OnPrem {
  cname: string;
  ttl: number;
}

export interface AzureData extends Azure {}

interface IDnsState {
  isFetching: boolean;
  azure?: AzureData[];
  onPrem?: OnPremData[];
  errors: Error[];
}

const initialState: IDnsState = {
  isFetching: false,
  azure: undefined,
  onPrem: undefined,
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
      state.onPrem = payload.data.affiliations.edges[0].node.cname.onPrem?.map(
        (it) => {
          return { ...it, cname: it.entry.cname, ttl: it.entry.ttl };
        }
      );
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
