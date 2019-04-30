import { IAppError, IErrorState } from 'models/StateManager/ErrorStateManager';
import { addError } from 'models/StateManager/state/actions';
import { connect } from 'react-redux';
import { RootState } from 'store/types';
import ErrorBoundary from './ErrorBoundary';
import { currentErrorAction, errorsAction, fetchErrors } from './state/actions';
import { IErrorBoundaryState } from './state/reducers';

const getErrors = (state: IErrorBoundaryState) => state.errors;
const getCurrentError = (state: IErrorBoundaryState) => state.currentError;

const mapStateToProps = (state: RootState) => ({
  errors: getErrors(state.errorBoundary),
  currentError: getCurrentError(state.errorBoundary),
  errorManager: state.errorStateManager.errors
});

export const ErrorBoundaryConnected = connect(
  mapStateToProps,
  {
    onFetch: (errorQueue: IAppError[]) => fetchErrors(errorQueue),
    addErrors: (errors: IErrorState) => errorsAction(errors),
    addCurrentError: (currentError?: IAppError) =>
      currentErrorAction(currentError),
    addError: (errors: IErrorState, error: Error) => addError(errors, error)
  }
)(ErrorBoundary);
