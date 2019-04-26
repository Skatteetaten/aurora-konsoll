import * as React from 'react';

import { ErrorBoundaryConnected } from 'components/ErrorBoundary/ErrorBoundaryConnected';

interface IAppError {
  id: number;
  error: Error;
  isActive: boolean;
}

interface IErrorStateManagerReduxProps {
  errors: IAppError;
  onAddError: (error: Map<number, IAppError>) => void;
}

class ErrorStateManagerRedux extends React.Component<
  IErrorStateManagerReduxProps,
  {}
> {
  public componentDidMount() {
    const { onAddError } = this.props;
    onAddError(new Map(null));
  }

  public incError(error: Map<number, IAppError>) {
    this.props.onAddError(error);
  }

  public render() {
    return <ErrorBoundaryConnected errorSM={errorStateManager} />;
  }
}

const errorStateManager = new ErrorStateManagerRedux(
  {
    errors: {
      errorQueue: [],
      allErrors: new Map()
    },
    onAddError: () => {
      return;
    }
  },
  () => {
    return;
  }
);

export default ErrorStateManagerRedux;
