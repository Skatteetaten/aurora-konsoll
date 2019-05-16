import {
  closeError,
  closeErrors,
  getNextError
} from 'models/StateManager/state/actions';
import { IErrorStateManagerState } from 'models/StateManager/state/reducer';
import { connect } from 'react-redux';
import { RootState } from 'store/types';
import ErrorBoundary from './ErrorBoundary';

const getErrors = (state: IErrorStateManagerState) => state.errors;

const getCurrentErrors = (state: IErrorStateManagerState) => state.nextError;

const mapStateToProps = (state: RootState) => ({
  errors: getErrors(state.errorStateManager),
  nextError: getCurrentErrors(state.errorStateManager)
});

export const ErrorBoundaryConnected = connect(
  mapStateToProps,
  {
    getNextError: () => getNextError(),
    closeError: (id: number) => closeError(id),
    closeErrors: () => closeErrors()
  }
)(ErrorBoundary);
