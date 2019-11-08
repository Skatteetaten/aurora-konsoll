import { createAction } from 'redux-ts-utils';
import { Thunk, StateThunk } from 'store/types';
import { IAppError, IErrors } from 'models/errors';
import { IGoboResult } from 'services/GoboClient';
import { Logger } from 'services/LoggerService';

const errors = (action: string) => `errors/${action}`;

export const errorsResponse = createAction<IErrors>(errors('ERRORS'));

export const incrementErrorId = createAction<number>(
  errors('INCREMENT_ERROR_ID_COUNT')
);

export const nextErrorResponse = createAction<IAppError | undefined>(
  errors('NEXT_ERROR')
);

export const addCurrentErrors = (
  result: IGoboResult<any> | undefined
): StateThunk => dispatch => {
  if (result && result.errors) {
    dispatch(addErrors(result.errors, result.name));
  }
};

export const addErrors = (errors: any[], name?: string): StateThunk => (
  dispatch,
  getState
) => {
  const state = Object.assign({}, getState().errors.errors);
  errors.forEach(e => {
    Logger.error(e.message, {
      location: window.location.pathname
    });
    dispatch(incrementErrorId());
    state.errorQueue.push({
      error: {
        stack: JSON.stringify(e.extensions),
        message: e.message,
        name: !!name ? `{"document": "${name}"}` : ''
      },
      id: getState().errors.errorCount,
      isActive: true
    });
  });
  dispatch(errorsResponse(state));
};

export const getNextError: Thunk = () => (dispatch, getState) => {
  const state = Object.assign({}, getState().errors.errors);
  const next = state.errorQueue.pop();
  if (!next) {
    dispatch(nextErrorResponse(undefined));
  } else {
    state.allErrors.set(next.id, next);
    dispatch(errorsResponse(state));
    dispatch(nextErrorResponse(next));
  }
};

export const closeError: Thunk = (id: number) => (dispatch, getState) => {
  const state = Object.assign({}, getState().errors.errors);
  const err = state.allErrors.get(id);
  if (!err) {
    throw new Error(`No such error ${id}`);
  }
  err.isActive = false;
  dispatch(errorsResponse(state));
};

export const closeErrors: Thunk = () => (dispatch, getState) => {
  const state = Object.assign({}, getState().errors.errors);
  const setIsActiveFalse = (err: IAppError) =>
    err.isActive === true && (err.isActive = false);

  state.allErrors.forEach(err => {
    setIsActiveFalse(err);
  });
  state.errorQueue.forEach(err => {
    setIsActiveFalse(err);
  });
  dispatch(errorsResponse(state));
};

export default {
  errorsResponse,
  incrementErrorId,
  nextErrorResponse
};
