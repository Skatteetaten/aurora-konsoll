import { IAppError, IErrorState } from 'models/StateManager/ErrorStateManager';
import * as React from 'react';
import ErrorPopup from './ErrorPopup';

interface IErrorBoundaryProps {
  addError: (error: Error) => void;
  addCurrentError: (currentError?: IAppError) => void;
  getNextError: () => IAppError;
  containsErrors: () => boolean;
  closeError: (id: number) => void;
  errors: IErrorState;
  currentErrors: IErrorState;
  currentError?: IAppError;
}

interface IErrorBoundaryState {
  errorCount: number;
}

class ErrorBoundary extends React.Component<
  IErrorBoundaryProps,
  IErrorBoundaryState
> {
  public state: IErrorBoundaryState = {
    errorCount: 0
  };

  public componentDidUpdate() {
    const {
      errors,
      containsErrors,
      currentError,
      currentErrors,
      addCurrentError,
      getNextError
    } = this.props;

    if (this.props.errors.errorQueue.length !== this.state.errorCount) {
      this.setState({
        errorCount: this.props.errors.errorQueue.length
      });
    }
    if (errors.errorQueue.length > currentErrors.errorQueue.length) {
      fetch('/api/log', {
        body: JSON.stringify({
          location: window.location.pathname,
          message: errors.errorQueue[0].error.message
        }),
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        method: 'POST'
      });
    }

    if (
      (containsErrors() && !currentError) ||
      (currentError && !currentError.isActive)
    ) {
      addCurrentError(getNextError());
    }
  }

  public render() {
    const { children, closeError, currentError } = this.props;
    return (
      <>
        {currentError && (
          <ErrorPopup
            currentError={currentError}
            closeError={closeError}
            errorCount={this.state.errorCount}
          />
        )}
        {children}
      </>
    );
  }
}

export default ErrorBoundary;
