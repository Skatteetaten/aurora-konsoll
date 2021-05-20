import { handleAction, reduceReducers } from 'redux-ts-utils';
import { DnsRawEntry } from 'services/auroraApiClients/dnsClient/query';
import { actions } from './actions';

interface IDnsState {
  isFetching: boolean;
  dnsEntires: DnsRawEntry[];
}

const initialState: IDnsState = {
  isFetching: false,
  dnsEntires: [],
};

export const dnsReducer = reduceReducers<IDnsState>(
  [
    handleAction(actions.fetchDnsEntries.request, (state) => {
      state.isFetching = true;
    }),
    handleAction(actions.fetchDnsEntries.success, (state, { payload }) => {
      state.isFetching = false;
      if (payload.data) {
        state.dnsEntires = payload.data.dnsEntires;
      }
    }),
  ],
  initialState
);
