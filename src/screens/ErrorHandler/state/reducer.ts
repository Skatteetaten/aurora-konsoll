import { createReducer } from '@reduxjs/toolkit';
import { ActionType } from 'typesafe-actions';
import actions, {
  closeError,
  getNextError,
  closeErrors,
  addErrors,
} from './actions';
import { IErrors, IAppError } from 'models/errors';
import { Logger } from 'services/LoggerService';

export type ErrorsAction = ActionType<typeof actions>;

export interface IErrorsState {
  errors: IErrors;
  errorCount: number;
  nextError?: IAppError;
}

const initialState: IErrorsState = {
  errors: {
    allErrors: {},
    errorQueue: [],
  },
  errorCount: 0,
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
  builder.addCase(closeError, (state, { payload }) => {
    const err = state.errors.allErrors[payload];
    if (!err) {
      throw new Error(`No such error ${payload}`);
    }
    err.isActive = false;
    state.nextError = undefined;
  });
  builder.addCase(getNextError, (state) => {
    const next = state.errors.errorQueue.pop();
    if (!next) {
      state.nextError = undefined;
    } else {
      state.errors.allErrors[next.id] = next;
      state.nextError = next;
    }
  });
  builder.addCase(closeErrors, (state) => {
    const setIsActiveFalse = (err: IAppError) =>
      err.isActive === true && (err.isActive = false);

    for (const key in state.errors.allErrors) {
      setIsActiveFalse(state.errors.allErrors[key]);
    }

    state.errors.errorQueue.forEach((err) => {
      setIsActiveFalse(err);
    });

    if (state.nextError) {
      state.nextError.isActive = false;
    }
  });

  builder.addCase(addErrors, (state, { payload }) => {
    payload.errors.forEach((e) => {
      if (!isIntegrationDisabledError(e)) {
        Logger.error(e.message, {
          location: window.location.pathname,
        });
        state.errorCount += 1;

        state.errors.errorQueue.push({
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
  });
});
