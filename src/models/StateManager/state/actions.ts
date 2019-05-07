import { IAppError, IErrorState } from 'models/StateManager/ErrorStateManager';
import { ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { createAction } from 'redux-ts-utils';
import { RootAction, RootState } from 'store/types';

const errorStateManagerAction = (action: string) =>
  `errorStateManager/${action}`;

export const allErrorsAction = createAction<IErrorState>(
  errorStateManagerAction('ALL_ERRORS')
);

export const incrementErrorCount = createAction<number>(
  errorStateManagerAction('INCREMENT_ERROR_COUNT')
);

export type Thunk = ActionCreator<ThunkAction<void, RootState, {}, RootAction>>;

export const addError: Thunk = (error: Error) => (dispatch, getState) => {
  dispatch(incrementErrorCount());
  getState().errorStateManager.errors.errorQueue.unshift({
    error,
    id: getState().errorStateManager.errorCount,
    isActive: true
  });
  dispatch(allErrorsAction(getState().errorStateManager.errors));
};

export const getNextError: Thunk = () => (
  dispatch,
  getState
): IAppError | undefined => {
  const errors = getState().errorStateManager.errors;
  const next = errors.errorQueue.pop();

  if (!next) {
    return;
  }
  errors.allErrors.set(next.id, next);
  dispatch(allErrorsAction(errors));
  return next;
};

export const closeError: Thunk = (id: number) => (dispatch, getState) => {
  const state = getState().errorStateManager.errors;
  const err = state.allErrors.get(id);
  if (!err) {
    throw new Error(`No such error ${id}`);
  }
  err.isActive = false;
  dispatch(allErrorsAction(state));
};

export const containsErrors: Thunk = () => (dispatch, getState): boolean => {
  return getState().errorStateManager.errors.errorQueue.length > 0;
};

export default {
  allErrorsAction,
  incrementErrorCount
};
