import * as React from 'react';
import { connect } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import { RootState, ReduxProps } from 'store/types';
import { DetailsView } from './DetailsView';
import {
  refreshApplicationDeployment,
  findApplicationDeploymentDetails,
  deleteApplicationDeployment
} from '../../state/actions';

export type ApplicationDeploymentMatchParams = {
  affiliation: string;
  applicationDeploymentId: string;
};

interface IApplicationDeploymentSelectorConnectedProps {
  filterPathUrl: string;
  affiliation: string;
  refreshApplicationDeployments: () => void;
}

type Props = IApplicationDeploymentSelectorConnectedProps &
  ApplicationDeploymentState;

const ApplicationDeploymentSelector = ({
  allApplicationDeploymentsResult,
  filterPathUrl,
  getApplicationDeploymentDetails,
  applicationDeploymentDetails,
  refreshCurrentApplicationDeployment,
  refreshApplicationDeployments,
  isFetchingDetails,
  isRefreshingApplicationDeployment,
  affiliation,
  deleteApplicationDeployment
}: Props) => {
  const match = useRouteMatch<ApplicationDeploymentMatchParams>();
  if (!match) {
    return null;
  }

  const deployment = allApplicationDeploymentsResult.find(
    d => d.id === match.params.applicationDeploymentId
  );

  if (!deployment) {
    return <p>Fant ikke deployment</p>;
  }

  return (
    <DetailsView
      deployment={deployment}
      filterPathUrl={filterPathUrl}
      findApplicationDeploymentDetails={getApplicationDeploymentDetails}
      deploymentDetails={applicationDeploymentDetails}
      refreshApplicationDeployment={refreshCurrentApplicationDeployment}
      refreshApplicationDeployments={refreshApplicationDeployments}
      isRefreshingApplicationDeployment={isRefreshingApplicationDeployment}
      affiliation={affiliation}
      isFetchingDetails={isFetchingDetails}
      deleteApplicationDeployment={deleteApplicationDeployment}
    />
  );
};

const mapDispatchToProps = {
  refreshCurrentApplicationDeployment: refreshApplicationDeployment,
  getApplicationDeploymentDetails: findApplicationDeploymentDetails,
  deleteApplicationDeployment
};

const mapStateToProps = ({ affiliationView }: RootState) => {
  const {
    isRefreshingApplicationDeployment,
    applicationDeploymentDetails,
    isFetchingDetails,
    allApplicationDeploymentsResult
  } = affiliationView;
  return {
    isRefreshingApplicationDeployment,
    applicationDeploymentDetails,
    isFetchingDetails,
    allApplicationDeploymentsResult
  };
};

type ApplicationDeploymentState = ReduxProps<
  typeof mapDispatchToProps,
  typeof mapStateToProps
>;

export const ApplicationDeploymentSelectorContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ApplicationDeploymentSelector);
