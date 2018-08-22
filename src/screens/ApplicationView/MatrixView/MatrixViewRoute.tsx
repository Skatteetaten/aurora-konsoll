import * as React from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';
import MatrixView, { IMatrixViewProps } from './MatrixView';

const renderComponent = (props: IMatrixViewProps) => (
  routerProps: RouteComponentProps<{}>
) => <MatrixView {...props} {...routerProps} />;

const MatrixViewRoute = (props: IMatrixViewProps) => (
  <Route
    exact={true}
    path="/app/:affiliation"
    render={renderComponent(props)}
  />
);

export default MatrixViewRoute;
