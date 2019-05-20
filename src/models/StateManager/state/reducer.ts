import { handleAction, reduceReducers } from 'redux-ts-utils';
import { ActionType } from 'typesafe-actions';
import { IErrorState, IAppError } from '../ErrorStateManager';
import actions, {
  errorsAction,
  incrementErrorId,
  nextErrorAction
} from './actions';

export type ErrorStateManagerAction = ActionType<typeof actions>;

export interface IErrorStateManagerState {
  readonly errors: IErrorState;
  readonly errorCount: number;
  readonly nextError?: IAppError;
}

function updateStateWithPayload(name: string) {
  return (
    state: IErrorStateManagerState,
    { payload }: ErrorStateManagerAction
  ) => {
    state[name] = payload;
  };
}

function incrementState(name: string) {
  return (state: IErrorStateManagerState) => {
    state[name] += 1;
  };
}

const initialState: IErrorStateManagerState = {
  errors: {
    allErrors: new Map(),
    errorQueue: []
  },
  errorCount: 0,
  nextError: undefined
};

export const errorStateManagerReducer = reduceReducers<IErrorStateManagerState>(
  [
    handleAction(errorsAction, updateStateWithPayload('errors')),
    handleAction(nextErrorAction, updateStateWithPayload('nextError')),
    handleAction(incrementErrorId, incrementState('errorCount'))
  ],
  initialState
);
