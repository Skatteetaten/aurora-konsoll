import { IAppError, IErrorState } from 'models/StateManager/ErrorStateManager';
import * as React from 'react';
import ErrorPopup from './ErrorPopup';

interface IErrorBoundaryProps {
  addError: (error: Error) => void;
  getNextError: () => IAppError;
  containsErrors: () => boolean;
  closeError: (id: number) => void;
  closeErrors: () => void;
  errors: IErrorState;
}

interface IErrorBoundaryState {
  currentError?: IAppError;
  currentErrors: IErrorState;
  isCalloutVisible: boolean;
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
    },
    isCalloutVisible: false
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

  public changeCalloutVisability = () => {
    this.setState(prevState => ({
      isCalloutVisible: !prevState.isCalloutVisible
    }));
  };

  public render() {
    const { children, closeError, closeErrors, errors } = this.props;
    const { currentError, isCalloutVisible } = this.state;

    return (
      <>
        {currentError && (
          <ErrorPopup
            currentError={currentError}
            closeError={closeError}
            closeErrors={closeErrors}
            errorCount={errors.errorQueue.length}
            isCalloutVisible={isCalloutVisible}
            changeCalloutVisability={this.changeCalloutVisability}
          />
        )}
        {children}
      </>
    );
  }
}

export default ErrorBoundary;
