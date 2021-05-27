import { createReducer } from '@reduxjs/toolkit';

import { INetdebugResult } from 'services/auroraApiClients';
import { ActionType } from 'typesafe-actions';
import actions, {
  fetchNetdebugStatusRequest,
  fetchNetdebugStatusResponse,
} from './actions';

export type NetdebugViewAction = ActionType<typeof actions>;

export interface INetdebugViewState {
  readonly isFetching: boolean;
  readonly netdebugStatus: INetdebugResult;
}

const initialState: INetdebugViewState = {
  isFetching: false,
  netdebugStatus: {
    failed: [],
    open: [],
    status: '',
  },
};

function updateStateWithPayload(name: string) {
  return (state: INetdebugViewState, { payload }: NetdebugViewAction) => {
    state[name] = payload;
  };
}

export const netdebugViewReducer = createReducer(initialState, (builder) => {
  builder.addCase(
    fetchNetdebugStatusRequest,
    updateStateWithPayload('isFetching')
  );
  builder.addCase(
    fetchNetdebugStatusResponse,
    updateStateWithPayload('netdebugStatus')
  );
});
