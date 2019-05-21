import { IAppError, IErrorState } from 'models/StateManager/ErrorStateManager';
import * as React from 'react';
import ErrorPopup from './ErrorPopup';

interface IErrorBoundaryProps {
  getNextError: () => void;
  closeError: (id: number) => void;
  closeErrors: () => void;
  errors: IErrorState;
  nextError?: IAppError;
}

interface IErrorBoundaryState {
  isExtraInfoVisable: boolean;
}

class ErrorBoundary extends React.Component<
  IErrorBoundaryProps,
  IErrorBoundaryState
> {
  public state: IErrorBoundaryState = {
    isExtraInfoVisable: false
  };

  public async componentDidUpdate(prevProps: IErrorBoundaryProps) {
    const { errors, getNextError, nextError } = this.props;

    if (errors.errorQueue.length !== prevProps.errors.errorQueue.length) {
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
      (errors.errorQueue.length > 0 && !nextError) ||
      (nextError && !nextError.isActive)
    ) {
      await getNextError();
    }
  }

  public changeExtraInfoVisability = () => {
    this.setState(prevState => ({
      isExtraInfoVisable: !prevState.isExtraInfoVisable
    }));
  };

  public render() {
    const { children, closeError, closeErrors, errors, nextError } = this.props;
    const { isExtraInfoVisable } = this.state;
    return (
      <>
        {nextError && (
          <ErrorPopup
            currentError={nextError}
            closeError={closeError}
            closeErrors={closeErrors}
            errorCount={errors.errorQueue.length}
            isExtraInfoVisable={isExtraInfoVisable}
            changeExtraInfoVisability={this.changeExtraInfoVisability}
          />
        )}
        {children}
      </>
    );
  }
}

export default ErrorBoundary;
