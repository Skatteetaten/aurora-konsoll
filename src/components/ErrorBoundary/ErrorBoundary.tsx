import { IAppError, IErrorState } from 'models/StateManager/ErrorStateManager';
import * as React from 'react';
import { StyledErrorPopup } from './ErrorPopup';

interface IErrorBoundaryProps {
  getNextError: () => IAppError;
  containsErrors: () => boolean;
  closeError: (id: number) => void;
  closeErrors: () => void;
  errors: IErrorState;
}

interface IErrorBoundaryState {
  currentError?: IAppError;
  currentErrors: IErrorState;
  isExtraInfoVisable: boolean;
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
    isExtraInfoVisable: false
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

  public changeExtraInfoVisability = () => {
    this.setState(prevState => ({
      isExtraInfoVisable: !prevState.isExtraInfoVisable
    }));
  };

  public render() {
    const { children, closeError, closeErrors, errors } = this.props;
    const { currentError, isExtraInfoVisable } = this.state;

    return (
      <>
        {currentError && (
          <StyledErrorPopup
            currentError={currentError}
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
