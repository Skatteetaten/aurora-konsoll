import { IErrorState } from 'models/StateManager/ErrorStateManager';
import { ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { createAction } from 'redux-ts-utils';
import { RootAction, RootState } from 'store/types';

const errorStateManagerAction = (action: string) =>
  `errorStateManager/${action}`;

export const allErrorsAction = createAction<IErrorState>(
  errorStateManagerAction('ALL_ERRORS')
);

export type Thunk = ActionCreator<ThunkAction<void, RootState, {}, RootAction>>;

export const addError: Thunk = (error: Error, errors?: IErrorState) => (
  dispatch,
  getState
) => {
  getState().errorStateManager.errors.errorQueue.unshift({
    error,
    id: getState().errorStateManager.errors.errorQueue[0].id += 1,
    isActive: true
  });
  dispatch(allErrorsAction(errors));
};

export const getNextError: Thunk = (error: Error) => (dispatch, getState) => {
  dispatch(allErrorsAction(getState().errorStateManager.errors));
};

export const closeError: Thunk = (
  errors: IErrorState,
  error: Error,
  id: number
) => (dispatch, getState) => {
  errors.errorQueue.pop();
  dispatch(allErrorsAction(errors));
};

export default { allErrorsAction };
