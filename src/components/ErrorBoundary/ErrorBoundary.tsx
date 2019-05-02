import ErrorStateManager, {
  IAppError,
  IErrorState
} from 'models/StateManager/ErrorStateManager';
import * as React from 'react';
import ErrorPopup from './ErrorPopup';

interface IErrorBoundaryProps {
  errorManager: IErrorState;
  addError: (errors: IErrorState, error: Error) => void;
  errorSM: ErrorStateManager;
  onFetch: (errorQueue: IAppError[]) => void;
  addErrors: (errors: IErrorState) => void;
  addCurrentError: (currentError?: IAppError) => void;
  errors: IErrorState;
  currentError?: IAppError;
}
class ErrorBoundary extends React.Component<IErrorBoundaryProps, {}> {
  public componentDidMount() {
    const { errorSM, onFetch, addErrors } = this.props;

    errorSM.registerStateUpdater(({ allErrors, errorQueue }) => {
      if (errorQueue.length > this.props.errorManager.errorQueue.length) {
        onFetch(this.props.errorManager.errorQueue);
      }
      addErrors({
        allErrors: new Map(allErrors),
        errorQueue: [...errorQueue]
      });
    });
  }

  public componentDidUpdate(prevProps: IErrorBoundaryProps) {
    const { errorSM, currentError, addCurrentError } = this.props;

    if (
      (errorSM.hasError() && !currentError) ||
      (currentError && !currentError.isActive)
    ) {
      addCurrentError(errorSM.getNextError());
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
