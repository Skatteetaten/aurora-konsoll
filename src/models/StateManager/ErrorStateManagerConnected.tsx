import { connect } from 'react-redux';
import { RootState } from 'store/types';
import { IAppError } from './ErrorStateManager';
import ErrorStateManagerRedux from './ErrorStateManagerRedux';
import { addError } from './state/actions';
import { IErrorStateManagerState } from './state/reducer';

const getAllErrors = (state: IErrorStateManagerState) => state.errors;

const mapStateToProps = (state: RootState) => ({
  allErrors: getAllErrors(state.errorStateManager)
});

export const ErrorStateManagerConnected = connect(
  mapStateToProps,
  {
    onAddError: (error: Map<number, IAppError>) => addError(error)
  }
)(ErrorStateManagerRedux);
