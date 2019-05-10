import { IAppError, IErrorState } from 'models/StateManager/ErrorStateManager';
import * as React from 'react';
import ErrorPopup from './ErrorPopup';

interface IErrorBoundaryProps {
  addError: (error: Error) => void;
  getNextError: () => IAppError;
  containsErrors: () => boolean;
  closeError: (id: number) => void;
  errors: IErrorState;
}

interface IErrorBoundaryState {
  currentError?: IAppError;
  currentErrors: IErrorState;
}

class ErrorBoundary extends React.Component<
  IErrorBoundaryProps,
  IErrorBoundaryState
> {
  public state: IErrorBoundaryState = {
    currentError: undefined,
    currentErrors: {
      allErrors: new Map(),
      errorQueue: []
    }
  };

  public componentDidUpdate() {
    const { errors, getNextError } = this.props;
    const { currentError, currentErrors } = this.state;

    if (errors.errorQueue.length !== currentErrors.errorQueue.length) {
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
      (errors.errorQueue.length > 0 && !currentError) ||
      (currentError && !currentError.isActive)
    ) {
      this.setState({
        currentError: getNextError(),
        currentErrors: errors
      });
    }
  }

  public render() {
    const { children, closeError, errors } = this.props;
    const { currentError } = this.state;

    return (
      <>
        {currentError && (
          <ErrorPopup
            currentError={currentError}
            closeError={closeError}
            errorCount={errors.errorQueue.length}
          />
        )}
        {children}
      </>
    );
  }
}

export default ErrorBoundary;
