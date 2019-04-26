import { ActionType } from 'typesafe-actions';
import actions, {
  currentErrorAction,
  errorsAction,
  fetchErrorsResponse
} from './actions';

import { IAppError, IErrorState } from 'models/StateManager/ErrorStateManager';
import { handleAction, reduceReducers } from 'redux-ts-utils';

export type ErrorBoundaryAction = ActionType<typeof actions>;

export interface IErrorBoundaryState {
  readonly errors: IErrorState;
  readonly currentError?: IAppError;
}

function updateStateWithPayload(name: string) {
  return (state: IErrorBoundaryState, { payload }: ErrorBoundaryAction) => {
    state[name] = payload;
  };
}

const initialState: IErrorBoundaryState = {
  errors: {
    allErrors: new Map(),
    errorQueue: []
  }
};

export const errorBoundaryReducer = reduceReducers<IErrorBoundaryState>(
  [
    handleAction(fetchErrorsResponse, updateStateWithPayload('response')),
    handleAction(errorsAction, updateStateWithPayload('errors')),
    handleAction(currentErrorAction, updateStateWithPayload('currentError'))
  ],
  initialState
);
