import { createReducer } from '@reduxjs/toolkit';
import { ActionType } from 'typesafe-actions';
import actions, {
  errorsResponse,
  nextErrorResponse,
  errorId,
  nextErr,
  closeAllErrors,
  addAllErrors,
} from './actions';
import { IErrors, IAppError } from 'models/errors';
import { Logger } from 'services/LoggerService';

export type ErrorsAction = ActionType<typeof actions>;

export interface IErrorsState {
  errors: IErrors;
  errorCount: number;
  nextError?: IAppError;
  errorId: number;
}

function updateStateWithPayload(name: string) {
  return (state: IErrorsState, { payload }: ErrorsAction) => {
    state[name] = payload;
  };
}

const initialState: IErrorsState = {
  errors: {
    allErrors: {},
    errorQueue: [],
  },
  errorCount: 0,
  errorId: 0,
};

const isIntegrationDisabledError = (e: any) => {
  if (
    e.hasOwnProperty('message') &&
    (e.message as string).includes(
      'integration is disabled for this environment'
    )
  ) {
    Logger.debug(e.message, {
      location: window.location.pathname,
    });
    return true;
  }
  return false;
};

export const errorsReducer = createReducer(initialState, (builder) => {
  builder.addCase(errorsResponse, updateStateWithPayload('errors'));
  builder.addCase(nextErrorResponse, updateStateWithPayload('nextError'));
  builder.addCase(errorId, (state, { payload }) => {
    const copiedState = Object.assign({}, state.errors);
    const err = copiedState.allErrors[payload];
    if (!err) {
      throw new Error(`No such error ${payload}`);
    }
    err.isActive = false;
    state.errors = copiedState;
    state.nextError = undefined;
  });
  builder.addCase(nextErr, (state) => {
    const copiedState = Object.assign({}, state.errors);

    const next = copiedState.errorQueue.pop();
    if (!next) {
      state.nextError = undefined;
    } else {
      copiedState.allErrors[next.id] = next;
      state.errors = copiedState;
      state.nextError = next;
    }
  });
  builder.addCase(closeAllErrors, (state) => {
    const copiedState = Object.assign({}, state.errors);
    const setIsActiveFalse = (err: IAppError) =>
      err.isActive === true && (err.isActive = false);

    for (const key in copiedState.allErrors) {
      setIsActiveFalse(copiedState.allErrors[key]);
    }

    copiedState.errorQueue.forEach((err) => {
      setIsActiveFalse(err);
    });

    if (state.nextError) {
      state.nextError.isActive = false;
    }

    state.errors = copiedState;
  });

  builder.addCase(addAllErrors, (state, { payload }) => {
    const copiedState = Object.assign({}, state.errors);
    payload.errors.forEach((e) => {
      if (!isIntegrationDisabledError(e)) {
        Logger.error(e.message, {
          location: window.location.pathname,
        });
        state.errorCount += 1;

        copiedState.errorQueue.push({
          error: {
            stack: JSON.stringify(e.extensions),
            message: e.message,
            name: !!payload.name ? `{"document": "${payload.name}"}` : '',
          },
          id: state.errorCount,
          isActive: true,
        });
      }
    });

    state.errors = copiedState;
  });
});
