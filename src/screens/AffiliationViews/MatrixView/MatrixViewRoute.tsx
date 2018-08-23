import * as React from 'react';
import { Route } from 'react-router-dom';
import { AffiliationRouteProps } from '../AffiliationRouteProps';
import MatrixView, { IMatrixViewProps } from './MatrixView';

const renderComponent = (props: IMatrixViewProps) => (
  routerProps: AffiliationRouteProps
) => <MatrixView {...props} {...routerProps} />;

const MatrixViewRoute = (props: IMatrixViewProps) => (
  <Route
    exact={true}
    path="/:affiliation/deployments"
    render={renderComponent(props)}
  />
);

export default MatrixViewRoute;
