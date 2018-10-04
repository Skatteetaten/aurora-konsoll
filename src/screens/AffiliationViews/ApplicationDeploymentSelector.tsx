import * as React from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';
import { IApplicationDeploymentContext } from './ApplicationDeploymentContext';
import { DetailsViewBaseWithApi } from './DetailsView/DetailsView';

export type ApplicationDeploymentDetailsRoute = RouteComponentProps<{
  affiliation: string;
  applicationDeploymentId: string;
}>;

type ApplicationDeploymentSelectorProps = IApplicationDeploymentContext &
  ApplicationDeploymentDetailsRoute;

const ApplicationDeploymentSelector = ({
  deployments,
  fetchApplicationDeployments,
  match
}: ApplicationDeploymentSelectorProps) => {
  const deployment = deployments.find(
    d => d.id === match.params.applicationDeploymentId
  );

  if (!deployment) {
    return <p>Fant ikke deployment</p>;
  }

  const DetailsView = (props: ApplicationDeploymentDetailsRoute) => (
    <DetailsViewBaseWithApi
      {...props}
      deployment={deployment}
      fetchApplicationDeployments={fetchApplicationDeployments}
    />
  );

  return <Route render={DetailsView} />;
};

export default ApplicationDeploymentSelector;
