import * as React from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';
import AcceptToken, { IAcceptTokenProps } from './AcceptToken';

const AcceptTokenWithRoute = (props: IAcceptTokenProps) => (
  routeProps: RouteComponentProps<{}>
) => <AcceptToken {...routeProps} {...props} />;

const AcceptTokenRoute = (props: IAcceptTokenProps) => (
  <Route path="/accept-token" render={AcceptTokenWithRoute(props)} />
);

export default AcceptTokenRoute;