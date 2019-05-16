import { IAppError, IErrorState } from 'models/StateManager/ErrorStateManager';
import { ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { createAction } from 'redux-ts-utils';
import { RootAction, RootState } from 'store/types';
import { IAuroraApiComponentProps } from 'components/AuroraApi';

const errorStateManagerAction = (action: string) =>
  `errorStateManager/${action}`;

export const errorsAction = createAction<IErrorState>(
  errorStateManagerAction('ERRORS')
);

export const incrementErrorId = createAction<number>(
  errorStateManagerAction('INCREMENT_ERROR_ID_COUNT')
);

export const nextErrorAction = createAction<IAppError | undefined>(
  errorStateManagerAction('NEXT_ERROR')
);

export type Thunk = ActionCreator<
  ThunkAction<void, RootState, IAuroraApiComponentProps, RootAction>
>;

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

export const getNextError: Thunk = () => (dispatch, getState) => {
  const state = Object.assign({}, getState().errorStateManager.errors);
  const next = state.errorQueue.pop();
  if (next) {
    state.allErrors.set(next.id, next);
    dispatch(errorsAction(state));
    dispatch(nextErrorAction(next));
  }
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
  console.log(state);
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

export default {
  errorsAction,
  incrementErrorId,
  nextErrorAction
};
