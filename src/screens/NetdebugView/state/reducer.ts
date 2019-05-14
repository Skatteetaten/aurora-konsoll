import { handleAction, reduceReducers } from 'redux-ts-utils';
import { INetdebugResult } from 'services/auroraApiClients';
import { ActionType } from 'typesafe-actions';
import actions, {
  fetchNetdebugStatusRequest,
  fetchNetdebugStatusResponse
} from './actions';

export type NetdebugViewAction = ActionType<typeof actions>;

export interface INetdebugViewState {
  readonly isFetching: boolean;
  readonly netdebugStatus?: INetdebugResult;
}

const initialState = (): INetdebugViewState => {
  return {
    isFetching: false
  };
};

function updateStateWithPayload(name: string) {
  return (state: INetdebugViewState, { payload }: NetdebugViewAction) => {
    state[name] = payload;
  };
}

export const netdebugViewReducer = reduceReducers<INetdebugViewState>(
  [
    handleAction(
      fetchNetdebugStatusRequest,
      updateStateWithPayload('isFetching')
    ),
    handleAction(
      fetchNetdebugStatusResponse,
      updateStateWithPayload('netdebugStatus')
    )
  ],
  initialState()
);
