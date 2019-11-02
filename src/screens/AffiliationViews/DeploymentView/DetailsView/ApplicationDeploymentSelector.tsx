import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import { RootState, ReduxProps } from 'store/types';
import { DetailsView } from './DetailsView';
import {
  refreshApplicationDeployment,
  deleteApplicationDeployment
} from '../../state/actions';
import {
  fetchApplicationDeploymentWithDetails,
  resetApplicationDeploymentState
} from 'store/state/applicationDeployments/action.creators';
import Spinner from 'components/Spinner';

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
  refreshCurrentApplicationDeployment,
  isRefreshingApplicationDeployment,
  affiliation,
  deleteApplicationDeployment,
  applicationDeployment,
  fetchApplicationDeploymentWithDetails,
  isFetching,
  resetApplicationDeploymentState
}: Props) => {
  const match = useRouteMatch<ApplicationDeploymentMatchParams>();

  const id = (match && match.params.applicationDeploymentId) || undefined;

  useEffect(() => {
    if (id) {
      fetchApplicationDeploymentWithDetails(id);
    }
    return () => {
      resetApplicationDeploymentState();
    };
  }, [
    id,
    resetApplicationDeploymentState,
    fetchApplicationDeploymentWithDetails
  ]);

  if (isFetching) {
    return <Spinner />;
  }

  if (!applicationDeployment) {
    return <p>Fant ikke deployment</p>;
  }

  return (
    <DetailsView
      deployment={applicationDeployment}
      filterPathUrl={filterPathUrl}
      refreshApplicationDeployment={refreshCurrentApplicationDeployment}
      isRefreshingApplicationDeployment={isRefreshingApplicationDeployment}
      affiliation={affiliation}
      deleteApplicationDeployment={deleteApplicationDeployment}
    />
  );
};

const mapDispatchToProps = {
  refreshCurrentApplicationDeployment: refreshApplicationDeployment,
  deleteApplicationDeployment,
  fetchApplicationDeploymentWithDetails,
  resetApplicationDeploymentState
};

const mapStateToProps = ({ affiliationView, applications }: RootState) => {
  const { isRefreshingApplicationDeployment } = affiliationView;
  const { applicationDeployment, isFetching } = applications;
  return {
    isFetching,
    applicationDeployment,
    isRefreshingApplicationDeployment
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
