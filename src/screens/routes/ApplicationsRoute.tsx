import * as React from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';
import Applications from './applicationsRoute/Applications';

interface IApplicationsRouteProps {
  affiliation?: string;
}

const ApplicationsWithRouter = (affiliation?: string) => (
  props: RouteComponentProps<{}>
) => <Applications affiliation={affiliation} {...props} />;

const ApplicationsRoute = ({ affiliation }: IApplicationsRouteProps) => (
  <Route path="/app" render={ApplicationsWithRouter(affiliation)} />
);

export default ApplicationsRoute;
