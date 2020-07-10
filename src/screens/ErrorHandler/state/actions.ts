import { createAction } from 'redux-ts-utils';
import { Thunk, AsyncAction } from 'store/types';
import { IAppError, IErrors } from 'models/errors';
import { IDataAndErrors } from 'services/GoboClient';
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
  result: IDataAndErrors<any> | undefined
): AsyncAction => (dispatch) => {
  if (result && result.errors) {
    dispatch(addErrors(result.errors, result.name));
  }
};

export const addErrors = (errors: any[], name?: string): AsyncAction => (
  dispatch,
  getState
) => {
  const state = Object.assign({}, getState().errors.errors);
  errors.forEach((e) => {
    if (!isIntegrationDisabledError(e)) {
      Logger.error(e.message, {
        location: window.location.pathname,
      });
      dispatch(incrementErrorId());
      state.errorQueue.push({
        error: {
          stack: JSON.stringify(e.extensions),
          message: e.message,
          name: !!name ? `{"document": "${name}"}` : '',
        },
        id: getState().errors.errorCount,
        isActive: true,
      });
    }
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

export const closeError = (id: number): AsyncAction => (dispatch, getState) => {
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

  state.allErrors.forEach((err) => {
    setIsActiveFalse(err);
  });
  state.errorQueue.forEach((err) => {
    setIsActiveFalse(err);
  });
  dispatch(errorsResponse(state));
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

export default {
  errorsResponse,
  incrementErrorId,
  nextErrorResponse,
};
