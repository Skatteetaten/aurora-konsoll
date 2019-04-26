import { IAuroraApiComponentProps } from 'components/AuroraApi';
import { IAppError, IErrorState } from 'models/StateManager/ErrorStateManager';
import { ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { createAction } from 'redux-ts-utils';
import { RootAction, RootState } from 'store/types';

const errorBoundaryAction = (action: string) => `errorBoundary/${action}`;

export const fetchErrorsResponse = createAction<Response>(
  errorBoundaryAction('FETCHED_ERRORS_RESPONSE')
);

export const errorsAction = createAction<IErrorState>(
  errorBoundaryAction('ERRORS')
);

export const currentErrorAction = createAction<IAppError | undefined>(
  errorBoundaryAction('CURRENT_ERROR')
);

export type Thunk = ActionCreator<
  ThunkAction<void, RootState, IAuroraApiComponentProps, RootAction>
>;

export const fetchErrors: Thunk = (errorQueue: IAppError[]) => async (
  dispatch,
  getState,
  { clients }
) => {
  const result: Response = await fetch('/api/log', {
    body: JSON.stringify({
      location: window.location.pathname,
      message: errorQueue[0].error.message
    }),
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    method: 'POST'
  });
  dispatch(fetchErrorsResponse(result));
};

export default {
  fetchErrorsResponse,
  errorsAction,
  currentErrorAction
};
