import * as React from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';
import Applications from './Applications';

interface IApplicationsRouteProps {
  affiliation?: string;
}

const ApplicationsWithRoute = (affiliation?: string) => (
  props: RouteComponentProps<{}>
) => <Applications affiliation={affiliation} {...props} />;

const ApplicationsRoute = ({ affiliation }: IApplicationsRouteProps) => (
  <Route path="/app" render={ApplicationsWithRoute(affiliation)} />
);

export default ApplicationsRoute;
