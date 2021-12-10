import {
  closeErrors,
  closeError,
  getNextError,
} from 'web/screens/ErrorHandler/state/actions';
import { IErrorsState } from 'web/screens/ErrorHandler/state/reducer';
import { connect } from 'react-redux';
import { RootState } from 'web/store/types';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';

const getCurrentErrors = (state: IErrorsState) => state.nextError;
const getErrors = (state: IErrorsState) => state.errors;

const mapStateToProps = (state: RootState) => ({
  errors: getErrors(state.errors),
  nextError: getCurrentErrors(state.errors),
});

export const ErrorBoundaryConnected = connect(mapStateToProps, {
  getNextError: () => getNextError(),
  closeError: (id: number) => closeError(id),
  closeErrors: () => closeErrors(),
})(ErrorBoundary);
