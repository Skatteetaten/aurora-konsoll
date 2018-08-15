import * as React from 'react';
import { Route } from 'react-router-dom';
import ApplicationViewWithApi from './ApplicationViewWithApi';

interface IApplicationsRouteProps {
  affiliation?: string;
}

const ApplicationRouteWrapper = (affiliation?: string) => () => (
  <ApplicationViewWithApi affiliation={affiliation} />
);

const ApplicationsRoute = ({ affiliation }: IApplicationsRouteProps) => (
  <Route path="/app" render={ApplicationRouteWrapper(affiliation)} />
);

export default ApplicationsRoute;
