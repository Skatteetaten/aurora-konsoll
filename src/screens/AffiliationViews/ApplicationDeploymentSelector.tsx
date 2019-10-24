import * as React from 'react';
import { connect } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import { RootState } from 'store/types';
import { DetailsView } from './DeploymentView/DetailsView/DetailsView';
import {
  refreshApplicationDeployment,
  findApplicationDeploymentDetails,
  findAllApplicationDeployments,
  deleteApplicationDeployment
} from './state/actions';
import {
  IApplicationDeploymentDetails,
  IApplicationDeployment
} from 'models/ApplicationDeployment';

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
  allDeployments: IApplicationDeployment[];
  filterPathUrl: string;
  affiliation: string;
  refreshApplicationDeployments: () => void;
}
export type ApplicationDeploymentMatchParams = {
  affiliation: string;
  applicationDeploymentId: string;
};

const ApplicationDeploymentSelector = ({
  allDeployments,
  getAllApplicationDeployments,
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
}: IApplicationDeploymentSelectorConnectedProps) => {
  const match = useRouteMatch<ApplicationDeploymentMatchParams>();
  if (!match) {
    return null;
  }

  const deployment = allDeployments.find(
    d => d.id === match.params.applicationDeploymentId
  );

  if (!deployment) {
    return <p>Fant ikke deployment</p>;
  }

  return (
    <DetailsView
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
