import { IWebsealState } from 'models/Webseal';
import { createReducer } from '@reduxjs/toolkit';
import { ActionType } from 'typesafe-actions';
import actions, {
  fetchWebsealStatesRequest,
  fetchWebsealStatesResponse,
} from './actions';

export type WebsealAction = ActionType<typeof actions>;

export interface IWebsealReduxState {
  readonly isFetchingWebsealStates: boolean;
  readonly websealStates: IWebsealState[];
}

const initialState: IWebsealReduxState = {
  isFetchingWebsealStates: false,
  websealStates: [],
};

function updateStateWithPayload(name: string) {
  return (state: IWebsealReduxState, { payload }: WebsealAction) => {
    state[name] = payload;
  };
}

export const websealReducer = createReducer(initialState, (builder) => {
  builder.addCase(
    fetchWebsealStatesRequest,
    updateStateWithPayload('isFetchingWebsealStates')
  );
  builder.addCase(
    fetchWebsealStatesResponse,
    updateStateWithPayload('websealStates')
  );
});
