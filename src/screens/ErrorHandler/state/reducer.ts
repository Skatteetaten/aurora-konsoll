import { createReducer } from '@reduxjs/toolkit';
import { ActionType } from 'typesafe-actions';
import actions, {
  errorsResponse,
  incrementErrorId,
  nextErrorResponse,
} from './actions';
import { IErrors, IAppError } from 'models/errors';

export type ErrorsAction = ActionType<typeof actions>;

export interface IErrorsState {
  errors: IErrors;
  errorCount: number;
  nextError?: IAppError;
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
    errorQueue: [],
  },
  errorCount: 0,
};

export const errorsReducer = createReducer(initialState, (builder) => {
  builder.addCase(errorsResponse, updateStateWithPayload('errors'));
  builder.addCase(nextErrorResponse, updateStateWithPayload('nextError'));
  builder.addCase(incrementErrorId, incrementState('errorCount'));
});
