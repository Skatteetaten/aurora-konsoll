import { createAction } from '@reduxjs/toolkit';
import { AsyncAction } from 'web/store/types';
import { IDataAndErrors } from 'web/services/GoboClient';

const errors = (action: string) => `errors/${action}`;

export const closeError = createAction<number>(errors('CLOSE_ERROR'));

export const getNextError = createAction<void>(errors('GET_NEXT_ERROR'));

export const closeErrors = createAction<void>(errors('CLOSE_ERRORS'));

export const addErrors = createAction<{ errors: any[]; name?: string }>(
  errors('ADD_ERRORS')
);

export const addCurrentErrors =
  (result: IDataAndErrors<any> | undefined): AsyncAction =>
  (dispatch) => {
    if (result && result.errors) {
      dispatch(addErrors({ errors: result.errors, name: result.name }));
    }
  };

const actions = {
  closeError,
  getNextError,
  closeErrors,
  addErrors,
};

export default actions;
