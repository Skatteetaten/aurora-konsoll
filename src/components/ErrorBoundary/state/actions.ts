import { IAppError, IErrorState } from 'models/StateManager/ErrorStateManager';
import { createAction } from 'redux-ts-utils';

const errorBoundaryAction = (action: string) => `errorBoundary/${action}`;

export const fetchErrorsResponse = createAction<Response>(
  errorBoundaryAction('FETCHED_ERRORS_RESPONSE')
);

export const currentErrors = createAction<IErrorState>(
  errorBoundaryAction('CURRENT_ERRORS')
);

export const currentErrorAction = createAction<IAppError | undefined>(
  errorBoundaryAction('CURRENT_ERROR')
);

export default {
  fetchErrorsResponse,
  currentErrors,
  currentErrorAction
};
