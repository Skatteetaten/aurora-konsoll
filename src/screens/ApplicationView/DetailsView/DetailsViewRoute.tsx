import * as React from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';
import DetailsView, { IDetailsViewProps } from './DetailsView';

type DetailsRouteProps = RouteComponentProps<{
  affiliation: string;
  environment: string;
  application: string;
}>;

const renderComponent = (props: IDetailsViewProps) => (
  routerProps: DetailsRouteProps
) => <DetailsView {...props} {...routerProps} />;

const DetailsViewRoute = (props: IDetailsViewProps) => (
  <Route
    exact={true}
    path="/app/:affiliation/details/:environment/:application"
    render={renderComponent(props)}
  />
);

export default DetailsViewRoute;
