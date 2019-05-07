import { IAppError } from 'models/StateManager/ErrorStateManager';
import {
  addError,
  closeError,
  containsErrors,
  getNextError
} from 'models/StateManager/state/actions';
import { IErrorStateManagerState } from 'models/StateManager/state/reducer';
import { connect } from 'react-redux';
import { RootState } from 'store/types';
import ErrorBoundary from './ErrorBoundary';
import { currentErrorAction } from './state/actions';
import { IErrorBoundaryState } from './state/reducers';

const getCurrentErrors = (state: IErrorBoundaryState) => state.currentErrors;
const getErrors = (state: IErrorStateManagerState) => state.errors;
const getCurrentError = (state: IErrorBoundaryState) => state.currentError;

const mapStateToProps = (state: RootState) => ({
  currentErrors: getCurrentErrors(state.errorBoundary),
  errors: getErrors(state.errorStateManager),
  currentError: getCurrentError(state.errorBoundary)
});

export const ErrorBoundaryConnected = connect(
  mapStateToProps,
  {
    addCurrentError: (currentError?: IAppError) =>
      currentErrorAction(currentError),
    addError: (error: Error) => addError(error),
    getNextError: () => getNextError(),
    containsErrors: () => containsErrors(),
    closeError: (id: number) => closeError(id)
  }
)(ErrorBoundary);
