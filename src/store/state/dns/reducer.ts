import { CnameInfo } from 'services/auroraApiClients/dnsClient/query';
import { actions } from './actions';
import { createReducer } from '@reduxjs/toolkit';

interface IDnsState {
  isFetching: boolean;
  cnameInfos?: CnameInfo[];
  errors: Error[];
}

const initialState: IDnsState = {
  isFetching: false,
  cnameInfos: [],
  errors: [],
};

export const dnsReducer = createReducer(initialState, (builder) => {
  builder.addCase(actions.fetchCnameInfosRequest.request, (state) => {
    state.isFetching = true;
  });
  builder.addCase(
    actions.fetchCnameInfosRequest.success,
    (state, { payload }) => {
      state.isFetching = false;
      if (payload.data) {
        state.cnameInfos = payload.data.cnameInfo;
      }
      if (payload.errors) {
        state.errors.push(...payload.errors);
      }
    }
  );
  builder.addCase(
    actions.fetchCnameInfosRequest.failure,
    (state, { payload }) => {
      state.isFetching = false;
      state.errors.push(payload);
    }
  );
});
