import * as React from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';
import { IApplicationDeploymentContext } from './ApplicationDeploymentContext';
import DetailsViewBase from './DetailsView/DetailsView';

export type ApplicationDeploymentDetailsRoute = RouteComponentProps<{
  affiliation: string;
  applicationDeploymentId: string;
}>;

type ApplicationDeploymentSelectorProps = IApplicationDeploymentContext &
  ApplicationDeploymentDetailsRoute;

const ApplicationDeploymentSelector = ({
  deployments,
  match
}: ApplicationDeploymentSelectorProps) => {
  const deployment = deployments.find(
    d => d.id === match.params.applicationDeploymentId
  );

  if (!deployment) {
    return <p>Not found</p>;
  }

  const DetailsView = (props: ApplicationDeploymentDetailsRoute) => (
    <DetailsViewBase {...props} deployment={deployment} />
  );

  return <Route render={DetailsView} />;
};

export default ApplicationDeploymentSelector;
