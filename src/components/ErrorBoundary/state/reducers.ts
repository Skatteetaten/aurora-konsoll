import { ActionType } from 'typesafe-actions';
import actions, {
  currentErrorAction,
  currentErrors,
  fetchErrorsResponse
} from './actions';

import { IAppError, IErrorState } from 'models/StateManager/ErrorStateManager';
import { handleAction, reduceReducers } from 'redux-ts-utils';

export type ErrorBoundaryAction = ActionType<typeof actions>;

export interface IErrorBoundaryState {
  readonly currentErrors: IErrorState;
  readonly currentError?: IAppError;
}

function updateStateWithPayload(name: string) {
  return (state: IErrorBoundaryState, { payload }: ErrorBoundaryAction) => {
    state[name] = payload;
  };
}

const initialState: IErrorBoundaryState = {
  currentErrors: {
    allErrors: new Map(),
    errorQueue: []
  }
};

export const errorBoundaryReducer = reduceReducers<IErrorBoundaryState>(
  [
    handleAction(fetchErrorsResponse, updateStateWithPayload('response')),
    handleAction(currentErrors, updateStateWithPayload('currentErrors')),
    handleAction(currentErrorAction, updateStateWithPayload('currentError'))
  ],
  initialState
);
