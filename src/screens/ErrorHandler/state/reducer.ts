import { handleAction, reduceReducers } from 'redux-ts-utils';
import { ActionType } from 'typesafe-actions';
import actions, {
  errorsResponse,
  incrementErrorId,
  nextErrorResponse
} from './actions';
import { IErrors, IAppError } from 'models/errors';

export type ErrorsAction = ActionType<typeof actions>;

export interface IErrorsState {
  readonly errors: IErrors;
  readonly errorCount: number;
  readonly nextError?: IAppError;
}

function updateStateWithPayload(name: string) {
  return (state: IErrorsState, { payload }: ErrorsAction) => {
    state[name] = payload;
  };
}

function incrementState(name: string) {
  return (state: IErrorsState) => {
    state[name] += 1;
  };
}

const initialState: IErrorsState = {
  errors: {
    allErrors: new Map(),
    errorQueue: []
  },
  errorCount: 0
};

export const errorsReducer = reduceReducers<IErrorsState>(
  [
    handleAction(errorsResponse, updateStateWithPayload('errors')),
    handleAction(nextErrorResponse, updateStateWithPayload('nextError')),
    handleAction(incrementErrorId, incrementState('errorCount'))
  ],
  initialState
);
