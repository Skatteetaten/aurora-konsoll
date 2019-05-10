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

export const incrementId = createAction<number>(
  errorStateManagerAction('INCREMENT_ERROR_COUNT')
);

export type Thunk = ActionCreator<ThunkAction<void, RootState, {}, RootAction>>;

export const addError: Thunk = (error: Error) => (dispatch, getState) => {
  const state = Object.assign({}, getState().errorStateManager.errors);
  dispatch(incrementId());
  state.errorQueue.unshift({
    error,
    id: getState().errorStateManager.errorCount,
    isActive: true
  });
  dispatch(allErrorsAction(state));
};

export const addErrors: Thunk = (errors: any[]) => (dispatch, getState) => {
  const state = Object.assign({}, getState().errorStateManager.errors);
  errors.forEach(e => {
    const error = new Error(`${e.message} ${JSON.stringify(e.extensions)}`);
    dispatch(incrementId());
    state.errorQueue.push({
      error,
      id: getState().errorStateManager.errorCount,
      isActive: true
    });
  });
  dispatch(allErrorsAction(state));
};

export const getNextError: Thunk = () => (
  dispatch,
  getState
): IAppError | undefined => {
  const state = Object.assign({}, getState().errorStateManager.errors);
  const next = state.errorQueue.pop();
  if (!next) {
    return;
  }
  state.allErrors.set(next.id, next);

  dispatch(allErrorsAction(state));
  return next;
};

export const closeError: Thunk = (id: number) => (dispatch, getState) => {
  const state = Object.assign({}, getState().errorStateManager.errors);
  const err = state.allErrors.get(id);
  if (!err) {
    throw new Error(`No such error ${id}`);
  }
  err.isActive = false;
  const errorState: IErrorState = state;
  dispatch(allErrorsAction(errorState));
};

export const containsErrors: Thunk = () => (dispatch, getState): boolean => {
  return getState().errorStateManager.errors.errorQueue.length > 0;
};

export default {
  allErrorsAction,
  incrementId
};
