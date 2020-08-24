import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import { RootState, ReduxProps } from 'store/types';
import { DetailsView } from './DetailsView';
import {
  deleteAndRefreshApplications,
  refreshApplicationDeployment,
  fetchApplicationDeploymentWithDetails,
  resetApplicationDeploymentState,
} from 'store/state/applicationDeployments/action.creators';
import Spinner from '@skatteetaten/frontend-components/Spinner';
import { SpinnerSize } from 'office-ui-fabric-react';

export type ApplicationDeploymentMatchParams = {
  affiliation: string;
  applicationDeploymentId: string;
};

interface IApplicationDeploymentSelectorConnectedProps {
  filterPathUrl: string;
  affiliation: string;
}

type Props = IApplicationDeploymentSelectorConnectedProps &
  ApplicationDeploymentState;

const ApplicationDeploymentSelector = ({
  filterPathUrl,
  refreshApplicationDeployment,
  affiliation,
  deleteAndRefreshApplications,
  applicationDeployment,
  fetchApplicationDeploymentWithDetails,
  isRefreshing,
  isFetching,
  resetApplicationDeploymentState,
}: Props) => {
  const match = useRouteMatch<ApplicationDeploymentMatchParams>();

  const id = (match && match.params.applicationDeploymentId) || undefined;

  useEffect(() => {
    if (id) {
      resetApplicationDeploymentState();
      fetchApplicationDeploymentWithDetails(id);
    }
    return () => {
      resetApplicationDeploymentState();
    };
  }, [
    id,
    resetApplicationDeploymentState,
    fetchApplicationDeploymentWithDetails,
  ]);

  if (isFetching) {
    return <Spinner size={SpinnerSize.large} />;
  }

  if (!applicationDeployment) {
    return <p>Fant ikke deployment</p>;
  }

  return (
    <DetailsView
      deployment={applicationDeployment}
      filterPathUrl={filterPathUrl}
      refreshApplicationDeployment={refreshApplicationDeployment}
      isRefreshing={isRefreshing}
      affiliation={affiliation}
      deleteAndRefreshApplications={deleteAndRefreshApplications}
    />
  );
};

const mapDispatchToProps = {
  refreshApplicationDeployment,
  deleteAndRefreshApplications,
  fetchApplicationDeploymentWithDetails,
  resetApplicationDeploymentState,
};

const mapStateToProps = ({ applications }: RootState) => {
  const { applicationDeployment, isFetching, isRefreshing } = applications;
  return {
    isRefreshing,
    isFetching,
    applicationDeployment,
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
