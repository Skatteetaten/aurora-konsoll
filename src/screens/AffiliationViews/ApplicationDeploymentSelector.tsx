import * as React from 'react';
import { connect } from 'react-redux';
import { Route, RouteComponentProps } from 'react-router-dom';
import { RootState } from 'store/types';
import { IApplicationDeploymentContext } from './ApplicationDeploymentContext';
import { DetailsView } from './DetailsView/DetailsView';
import {
  refreshApplicationDeployment,
  findApplicationDeploymentDetails,
  findAllApplicationDeployments,
  deleteApplicationDeployment
} from './state/actions';
import { IApplicationDeploymentDetails } from 'models/ApplicationDeployment';

interface IApplicationDeploymentSelectorConnectedProps {
  refreshCurrentApplicationDeployment: (
    applicationDeploymentId: string,
    affiliation: string
  ) => void;
  getAllApplicationDeployments: (affiliation: string) => void;
  getApplicationDeploymentDetails: (id: string) => void;
  isRefreshingApplicationDeployment: boolean;
  isFetchingDetails: boolean;
  applicationDeploymentDetails: IApplicationDeploymentDetails;
  isApplicationDeploymentDeleted: boolean;
  deleteApplicationDeployment: (namespace: string, name: string) => void;
}
export type ApplicationDeploymentDetailsRoute = RouteComponentProps<{
  affiliation: string;
  applicationDeploymentId: string;
}>;

type ApplicationDeploymentSelectorProps = IApplicationDeploymentContext &
  ApplicationDeploymentDetailsRoute &
  IApplicationDeploymentSelectorConnectedProps;

const ApplicationDeploymentSelector = ({
  allDeployments,
  getAllApplicationDeployments,
  match,
  filterPathUrl,
  getApplicationDeploymentDetails,
  applicationDeploymentDetails,
  refreshCurrentApplicationDeployment,
  refreshApplicationDeployments,
  isFetchingDetails,
  isRefreshingApplicationDeployment,
  affiliation,
  isApplicationDeploymentDeleted,
  deleteApplicationDeployment
}: ApplicationDeploymentSelectorProps) => {
  const deployment = allDeployments.find(
    d => d.id === match.params.applicationDeploymentId
  );

  if (!deployment) {
    return <p>Fant ikke deployment</p>;
  }

  const DetailsViewWithRoute = (props: ApplicationDeploymentDetailsRoute) => (
    <DetailsView
      {...props}
      deployment={deployment}
      getAllApplicationDeployments={getAllApplicationDeployments}
      filterPathUrl={filterPathUrl}
      findApplicationDeploymentDetails={getApplicationDeploymentDetails}
      deploymentDetails={applicationDeploymentDetails}
      refreshApplicationDeployment={refreshCurrentApplicationDeployment}
      refreshApplicationDeployments={refreshApplicationDeployments}
      isRefreshingApplicationDeployment={isRefreshingApplicationDeployment}
      affiliation={affiliation}
      isFetchingDetails={isFetchingDetails}
      isApplicationDeploymentDeleted={isApplicationDeploymentDeleted}
      deleteApplicationDeployment={deleteApplicationDeployment}
    />
  );

  return <Route render={DetailsViewWithRoute} />;
};

export default ApplicationDeploymentSelector;

const mapStateToProps = (state: RootState) => ({
  isRefreshingApplicationDeployment:
    state.affiliationView.isRefreshingApplicationDeployment,
  applicationDeploymentDetails:
    state.affiliationView.applicationDeploymentDetails,
  isFetchingDetails: state.affiliationView.isFetchingDetails,
  isApplicationDeploymentDeleted:
    state.affiliationView.isApplicationDeploymentDeleted
});

export const ApplicationDeploymentSelectorConnected = connect(
  mapStateToProps,
  {
    refreshCurrentApplicationDeployment: (
      applicationDeploymentId: string,
      affiliation: string
    ) => refreshApplicationDeployment(applicationDeploymentId, affiliation),
    getApplicationDeploymentDetails: (id: string) =>
      findApplicationDeploymentDetails(id),
    getAllApplicationDeployments: (affiliation: string) =>
      findAllApplicationDeployments([affiliation]),
    deleteApplicationDeployment: (namespace: string, name: string) =>
      deleteApplicationDeployment(namespace, name)
  }
)(ApplicationDeploymentSelector);
