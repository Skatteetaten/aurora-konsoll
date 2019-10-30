import React, { useEffect } from 'react';

import { IErrors, IAppError } from 'models/errors';
import ErrorPopup from './ErrorPopup';

interface IErrorBoundaryProps {
  getNextError: () => void;
  closeError: (id: number) => void;
  closeErrors: () => void;
  errors: IErrors;
  nextError?: IAppError;
  children: React.ReactNode;
}

const ErrorBoundary = ({
  getNextError,
  closeError,
  closeErrors,
  errors,
  nextError,
  children
}: IErrorBoundaryProps) => {
  const [errorQueue, setErrorQueue] = React.useState<IAppError[]>([]);

  useEffect(() => {
    const isEqualErrorQueues = () => {
      return (
        JSON.stringify(Object.assign({}, errors.errorQueue)) ===
        JSON.stringify(Object.assign({}, errorQueue))
      );
    };
    if (!isEqualErrorQueues() && errors.errorQueue.length > 0) {
      setErrorQueue(Object.assign({}, errors.errorQueue));
    }
  }, [errorQueue, errors.errorQueue]);

  if (
    (errors.errorQueue.length > 0 && !nextError) ||
    (nextError && !nextError.isActive)
  ) {
    getNextError();
  }
  return (
    <>
      {nextError && (
        <ErrorPopup
          currentError={nextError}
          closeError={closeError}
          closeErrors={closeErrors}
          errorCount={errors.errorQueue.length}
        />
      )}
      {children}
    </>
  );
};

export default ErrorBoundary;
