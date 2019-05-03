import ErrorStateManager, {
  IAppError,
  IErrorState
} from 'models/StateManager/ErrorStateManager';
import * as React from 'react';
import ErrorPopup from './ErrorPopup';

interface IErrorBoundaryProps {
  addError: (error: Error) => void;
  errorSM: ErrorStateManager;
  addCurrentError: (currentError?: IAppError) => void;
  getNextError: () => void;
  containsErrors: () => void;
  errors: IErrorState;
  hasError: boolean;
  currentErrors: IErrorState;
  currentError?: IAppError;
}

class ErrorBoundary extends React.Component<IErrorBoundaryProps, {}> {
  public componentDidUpdate() {
    const {
      errors,
      containsErrors,
      currentError,
      currentErrors,
      addCurrentError,
      getNextError,
      hasError
    } = this.props;
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
    getNextError();
    containsErrors();
    if (
      hasError &&
      !currentError
      // || ( && !currentError.isActive)
    ) {
      addCurrentError(errors.errorQueue[errors.errorQueue.length - 1]);
    }
  }

  public componentWillUnmount() {
    this.props.errorSM.close();
  }

  public render() {
    const { errorSM, errors, currentError, children } = this.props;
    return (
      <>
        {currentError && (
          <ErrorPopup
            currentError={currentError}
            closeError={errorSM.closeError}
            errorCount={errors.errorQueue.length}
          />
        )}
        {children}
      </>
    );
  }
}

export default ErrorBoundary;
