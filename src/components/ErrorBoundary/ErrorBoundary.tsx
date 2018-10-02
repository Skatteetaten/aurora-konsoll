import ErrorStateManager, {
  IAppError,
  IErrorState
} from 'models/StateManager/ErrorStateManager';
import * as React from 'react';
import ErrorPopup from './ErrorPopup';

interface IErrorBoundaryProps {
  errorSM: ErrorStateManager;
}

interface IErrorBoundaryState {
  currentError?: IAppError;
  errors: IErrorState;
}

class ErrorBoundary extends React.Component<
  IErrorBoundaryProps,
  IErrorBoundaryState
> {
  public state: IErrorBoundaryState = {
    errors: {
      allErrors: new Map(),
      errorQueue: []
    }
  };

  constructor(props: IErrorBoundaryProps) {
    super(props);
    props.errorSM.registerStateUpdater(({ allErrors, errorQueue }) => {
      if (errorQueue.length > this.state.errors.errorQueue.length) {
        fetch('/api/log', {
          body: JSON.stringify({
            message: errorQueue[0].error.message
          }),
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          method: 'POST'
        });
      }
      this.setState({
        errors: {
          allErrors: new Map(allErrors),
          errorQueue: [...errorQueue]
        }
      });
    });
  }

  public componentDidUpdate() {
    const { errorSM } = this.props;
    const { currentError } = this.state;
    if (
      (errorSM.hasError() && !currentError) ||
      (currentError && !currentError.isActive)
    ) {
      this.setState({
        currentError: errorSM.getNextError()
      });
    }
  }

  public render() {
    const { errorSM } = this.props;
    const { currentError, errors } = this.state;
    return (
      <>
        {currentError && (
          <ErrorPopup
            currentError={currentError}
            closeError={errorSM.closeError}
            errorCount={errors.errorQueue.length}
          />
        )}
        {this.props.children}
      </>
    );
  }
}

export default ErrorBoundary;
