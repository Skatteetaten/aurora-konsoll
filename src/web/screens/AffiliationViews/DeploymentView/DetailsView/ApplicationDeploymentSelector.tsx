import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import { RootState, ReduxProps } from 'web/store/types';
import { DetailsView } from './DetailsView';
import {
  deleteAndRefreshApplications,
  refreshApplicationDeployment,
  fetchApplicationDeploymentWithDetails,
  resetApplicationDeploymentState,
  setApplicationDeploymentId,
} from 'web/store/state/applicationDeployments/action.creators';
import { Spinner } from '@skatteetaten/frontend-components';
import { SpinnerSize } from '@fluentui/react';

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
  setApplicationDeploymentId,
}: Props) => {
  const match = useRouteMatch<ApplicationDeploymentMatchParams>();

  const id = (match && match.params.applicationDeploymentId) || undefined;

  // This useEffect is added to avoid receiving the previous applicationDeployment object in the current DetailsView,
  // which happened when the fetch call started in the previous DetailsView was not completed before entering a new DetailsView.
  // TODO: use local state to avoid problems caused by using a global state for DetailsView
  useEffect(() => {
    setApplicationDeploymentId(id);
  }, [id, setApplicationDeploymentId]);

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
  setApplicationDeploymentId,
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
