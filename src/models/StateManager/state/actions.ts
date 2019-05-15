import { IAppError, IErrorState } from 'models/StateManager/ErrorStateManager';
import { ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { createAction } from 'redux-ts-utils';
import { RootAction, RootState } from 'store/types';

const errorStateManagerAction = (action: string) =>
  `errorStateManager/${action}`;

export const errorsAction = createAction<IErrorState>(
  errorStateManagerAction('ERRORS')
);

export const incrementErrorId = createAction<number>(
  errorStateManagerAction('INCREMENT_ERROR_ID_COUNT')
);

export type Thunk = ActionCreator<ThunkAction<void, RootState, {}, RootAction>>;

export const addErrors: Thunk = (errors: any[], name?: string) => (
  dispatch,
  getState
) => {
  const state = Object.assign({}, getState().errorStateManager.errors);
  errors.forEach(e => {
    dispatch(incrementErrorId());
    state.errorQueue.push({
      error: {
        stack: JSON.stringify(e.extensions),
        message: e.message,
        name: !!name ? `{"document": "${name}"}` : ''
      },
      id: getState().errorStateManager.errorCount,
      isActive: true
    });
  });
  dispatch(errorsAction(state));
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
  dispatch(errorsAction(state));
  return next;
};

export const closeError: Thunk = (id: number) => (dispatch, getState) => {
  const state = Object.assign({}, getState().errorStateManager.errors);
  const err = state.allErrors.get(id);
  if (!err) {
    throw new Error(`No such error ${id}`);
  }
  err.isActive = false;
  dispatch(errorsAction(state));
};

export const closeErrors: Thunk = () => (dispatch, getState) => {
  const state = Object.assign({}, getState().errorStateManager.errors);

  const setIsActiveFalse = (err: IAppError) =>
    err.isActive === true && (err.isActive = false);

  state.allErrors.forEach(err => {
    setIsActiveFalse(err);
  });
  state.errorQueue.forEach(err => {
    setIsActiveFalse(err);
  });
  dispatch(errorsAction(state));
};

export const containsErrors: Thunk = () => (dispatch, getState): boolean => {
  return getState().errorStateManager.errors.errorQueue.length > 0;
};

export default {
  allErrorsAction: errorsAction,
  incrementId: incrementErrorId
};
