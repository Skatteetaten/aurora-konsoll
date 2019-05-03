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

export const incrementErrorCount = createAction<number>(
  errorStateManagerAction('INCREMENT_ERROR_COUNT')
);

export const hasError = createAction<boolean>(
  errorStateManagerAction('HAS_ERROR')
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

export const getNextError: Thunk = () => (dispatch, getState) => {
  getState().errorStateManager.errors.errorQueue.pop();

  dispatch(allErrorsAction(getState().errorStateManager.errors));
};

export const closeError: Thunk = (id: number) => (dispatch, getState) => {
  const errorId = getState().errorStateManager.errors.errorQueue.find(
    it => it.id === id
  );
  if (errorId) {
    errorId.isActive = false;
  }
  dispatch(allErrorsAction(getState().errorStateManager.errors));
};

export const containsErrors: Thunk = () => (dispatch, getState) => {
  dispatch(hasError(getState().errorStateManager.errors.errorQueue.length > 0));
};

export default {
  allErrorsAction,
  incrementErrorCount,
  hasError
};
