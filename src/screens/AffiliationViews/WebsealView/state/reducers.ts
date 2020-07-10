import { IWebsealState } from 'models/Webseal';
import { handleAction, reduceReducers } from 'redux-ts-utils';
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

const InitialState = (): IWebsealReduxState => {
  return {
    isFetchingWebsealStates: false,
    websealStates: [],
  };
};

function updateStateWithPayload(name: string) {
  return (state: IWebsealReduxState, { payload }: WebsealAction) => {
    state[name] = payload;
  };
}

export const websealReducer = reduceReducers<IWebsealReduxState>(
  [
    handleAction(
      fetchWebsealStatesRequest,
      updateStateWithPayload('isFetchingWebsealStates')
    ),
    handleAction(
      fetchWebsealStatesResponse,
      updateStateWithPayload('websealStates')
    ),
  ],
  InitialState()
);
