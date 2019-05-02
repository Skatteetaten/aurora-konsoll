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

export const decementErrorCount = createAction<number>(
  errorStateManagerAction('DECREMENT_ERROR_COUNT')
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
  dispatch(decementErrorCount());

  getState().errorStateManager.errors.errorQueue.shift();

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

export default { allErrorsAction, incrementErrorCount, decementErrorCount };
