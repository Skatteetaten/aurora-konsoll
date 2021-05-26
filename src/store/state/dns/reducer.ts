import { handleAction, reduceReducers } from 'redux-ts-utils';
import { CnameInfo } from 'services/auroraApiClients/dnsClient/query';
import { actions } from './actions';

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

export const dnsReducer = reduceReducers<IDnsState>(
  [
    handleAction(actions.fetchDnsEntries.request, (state) => {
      state.isFetching = true;
      state.cnameInfos = [];
    }),
    handleAction(actions.fetchDnsEntries.success, (state, { payload }) => {
      state.isFetching = false;
      if (payload.data) {
        state.cnameInfos = payload.data.cnameInfo;
      }
      if (payload.errors) {
        state.errors.push(...payload.errors);
      }
    }),
    handleAction(actions.fetchDnsEntries.failure, (state, { payload }) => {
      state.isFetching = false;
      state.errors.push(payload);
    }),
  ],
  initialState
);
