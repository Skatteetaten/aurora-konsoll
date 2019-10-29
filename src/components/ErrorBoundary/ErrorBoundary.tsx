import * as React from 'react';
import ErrorPopup from './ErrorPopup';
import { IErrors, IAppError } from 'models/errors';
import { Logger } from 'services/LoggerService';

interface IErrorBoundaryProps {
  getNextError: () => void;
  closeError: (id: number) => void;
  closeErrors: () => void;
  errors: IErrors;
  nextError?: IAppError;
}

interface IErrorBoundaryState {
  isExtraInfoVisible: boolean;
  errorQueue: IAppError[];
}

class ErrorBoundary extends React.Component<
IErrorBoundaryProps,
IErrorBoundaryState
> {
  public state: IErrorBoundaryState = {
    isExtraInfoVisible: false,
    errorQueue: []
  };
  public async componentDidUpdate() {
    const { errors, getNextError, nextError } = this.props;
    const { errorQueue } = this.state;

    const isEqualErrorQueues = () => {
      return (
        JSON.stringify(Object.assign({}, errors.errorQueue)) ===
        JSON.stringify(Object.assign({}, errorQueue))
      );
    };
    if (!isEqualErrorQueues() && errors.errorQueue.length > 0) {
      const err = errors.errorQueue[0].error;
      Logger.error(err.message, {
        location: window.location.pathname
      });
      this.setState({
        errorQueue: Object.assign({}, this.props.errors.errorQueue)
      });
    }
    if (
      (errors.errorQueue.length > 0 && !nextError) ||
      (nextError && !nextError.isActive)
    ) {
      getNextError();
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
