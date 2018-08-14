import * as React from 'react';
import { Route } from 'react-router-dom';
import Applications from './Applications';

interface IApplicationsRouteProps {
  affiliation?: string;
}

const ApplicationsWithRoute = (affiliation?: string) => () => (
  <Applications affiliation={affiliation} />
);

const ApplicationsRoute = ({ affiliation }: IApplicationsRouteProps) => (
  <Route path="/app" render={ApplicationsWithRoute(affiliation)} />
);

export default ApplicationsRoute;
