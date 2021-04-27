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
  setApplicationDeployment,
} from 'store/state/applicationDeployments/action.creators';
import Spinner from '@skatteetaten/frontend-components/Spinner';
import { SpinnerSize } from 'office-ui-fabric-react';
import { usePrevious } from 'utils/hooks/usePrevious';

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
  setApplicationDeployment,
}: Props) => {
  const match = useRouteMatch<ApplicationDeploymentMatchParams>();

  const id = (match && match.params.applicationDeploymentId) || undefined;

  const prevApplicationDeployment = usePrevious(applicationDeployment);

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

  useEffect(() => {
    if (
      id !== undefined &&
      applicationDeployment !== undefined &&
      id !== applicationDeployment.id &&
      prevApplicationDeployment &&
      prevApplicationDeployment.id === id
    ) {
      setApplicationDeployment(prevApplicationDeployment);
    }
  }, [
    applicationDeployment,
    fetchApplicationDeploymentWithDetails,
    id,
    prevApplicationDeployment,
    resetApplicationDeploymentState,
    setApplicationDeployment,
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
  setApplicationDeployment,
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
