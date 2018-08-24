import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { IApplicationDeploymentContext } from './ApplicationDeploymentContext';
import DetailsView from './DetailsView/DetailsView';

type ApplicationDeploymentSelectorProps = IApplicationDeploymentContext &
  RouteComponentProps<{
    affiliation: string;
    applicationDeploymentId: string;
  }>;

const ApplicationDeploymentSelector = ({
  deployments,
  match
}: ApplicationDeploymentSelectorProps) => {
  const deployment = deployments.find(
    d => d.id === match.params.applicationDeploymentId
  );
  return deployment ? (
    <DetailsView deployment={deployment} />
  ) : (
    <p>Not found</p>
  );
};

export default ApplicationDeploymentSelector;
