import * as React from 'react';
import { Route } from 'react-router-dom';
import ApplicationViewWithApi from './ApplicationViewWithApi';

interface IApplicationViewWithApiRouteProps {
  affiliation?: string;
}

const renderComponent = (affiliation?: string) => () => (
  <ApplicationViewWithApi affiliation={affiliation} />
);

const ApplicationsViewWithApiRoute = ({
  affiliation
}: IApplicationViewWithApiRouteProps) => (
  <Route path="/app" render={renderComponent(affiliation)} />
);

export default ApplicationsViewWithApiRoute;
