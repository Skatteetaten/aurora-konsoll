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

  // tslint:disable-next-line:no-console
  console.log(
    getState().errorStateManager.errors.errorQueue.unshift({
      error,
      id: getState().errorStateManager.errorCount,
      isActive: true
    })
  );
  dispatch(allErrorsAction(error));
};

export default { allErrorsAction };
