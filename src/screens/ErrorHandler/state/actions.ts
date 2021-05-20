import { createAction } from '@reduxjs/toolkit';
import { Thunk, AsyncAction } from 'store/types';
import { IAppError, IErrors } from 'models/errors';
import { IDataAndErrors } from 'services/GoboClient';

const errors = (action: string) => `errors/${action}`;

export const errorsResponse = createAction<IErrors>(errors('ERRORS'));

export const incrementErrorId = createAction<void>(
  errors('INCREMENT_ERROR_ID_COUNT')
);

export const nextErrorResponse = createAction<IAppError | undefined>(
  errors('NEXT_ERROR')
);

export const errorId = createAction<number>(errors('ERROR_ID'));

export const nextErr = createAction<void>(errors('NEXT_ERR'));

export const closeAllErrors = createAction<void>(errors('CLOSE_ALL_ERRORS'));

export const addAllErrors = createAction<{ errors: any[]; name?: string }>(
  errors('ADD_ALL_ERRORS')
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
  dispatch(addAllErrors({ errors, name }));
};

export function closeError(id: number): AsyncAction {
  return (dispatch) => {
    dispatch(errorId(id));
  };
}

export const getNextError: Thunk = () => (dispatch, getState) => {
  dispatch(nextErr());
};

export const closeErrors: Thunk = () => (dispatch, getState) => {
  dispatch(closeAllErrors());
};

export default {
  errorsResponse,
  incrementErrorId,
  nextErrorResponse,
  errorId,
  nextErr,
  closeAllErrors,
  addAllErrors,
};
