import * as React from 'react';
import ErrorPopup from './ErrorPopup';
import { IErrors, IAppError } from 'models/errors';

interface IErrorBoundaryProps {
  getNextError: () => void;
  closeError: (id: number) => void;
  closeErrors: () => void;
  errors: IErrors;
  nextError?: IAppError;
}

interface IErrorBoundaryState {
  isExtraInfoVisible: boolean;
}

class ErrorBoundary extends React.Component<
  IErrorBoundaryProps,
  IErrorBoundaryState
> {
  public state: IErrorBoundaryState = {
    isExtraInfoVisible: false
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

  public changeExtraInfoVisibility = () => {
    this.setState(prevState => ({
      isExtraInfoVisible: !prevState.isExtraInfoVisible
    }));
  };

  public render() {
    const { children, closeError, closeErrors, errors, nextError } = this.props;
    const { isExtraInfoVisible } = this.state;
    return (
      <>
        {nextError && (
          <ErrorPopup
            currentError={nextError}
            closeError={closeError}
            closeErrors={closeErrors}
            errorCount={errors.errorQueue.length}
            isExtraInfoVisible={isExtraInfoVisible}
            changeExtraInfoVisibility={this.changeExtraInfoVisibility}
          />
        )}
        {children}
      </>
    );
  }
}

export default ErrorBoundary;
