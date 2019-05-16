import { ITagsPaged, ITagsPagedGroup } from 'models/Tag';
import * as React from 'react';
import { connect } from 'react-redux';
import { Route, RouteComponentProps } from 'react-router-dom';
import { RootState } from 'store/types';
import { IApplicationDeploymentContext } from './ApplicationDeploymentContext';
import { DetailsViewBaseWithApi } from './DetailsView/DetailsView';
import {
  findGroupedTagsPaged,
  findTagsPaged,
  redeployWithCurrentVersion,
  redeployWithVersion,
  refreshApplicationDeployment,
  findApplicationDeploymentDetails
} from './state/actions';
import { IApplicationDeploymentDetails } from 'models/ApplicationDeployment';

interface IApplicationDeploymentSelectorConnectedProps {
  redeployWithNewVersion: (
    applicationDeploymentId: string,
    version: string
  ) => void;
  refreshCurrentApplicationDeployment: (
    applicationDeploymentId: string
  ) => void;
  redeployWithCurrent: (applicationDeploymentId: string) => void;
  getGroupedTagsPaged: (repository: string) => void;
  getTagsPaged: (
    repository: string,
    type: string,
    first?: number,
    cursor?: string
  ) => void;
  getApplicationDeploymentDetails: (id: string) => void;
  findTagsPagedResponse: ITagsPaged;
  findGroupedTagsPagedResult: ITagsPagedGroup;
  isRefreshingApplicationDeployment: boolean;
  redeployWithVersionResult: boolean;
  redeployWithCurrentVersionResult: boolean;
  applicationDeploymentDetails: IApplicationDeploymentDetails;
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
  fetchApplicationDeployments,
  match,
  filterPathUrl,
  getApplicationDeploymentDetails,
  applicationDeploymentDetails,
  refreshCurrentApplicationDeployment,
  redeployWithNewVersion,
  redeployWithVersionResult,
  redeployWithCurrent,
  redeployWithCurrentVersionResult,
  getGroupedTagsPaged,
  getTagsPaged,
  findTagsPagedResponse,
  findGroupedTagsPagedResult,
  isRefreshingApplicationDeployment
}: ApplicationDeploymentSelectorProps) => {
  const deployment = allDeployments.find(
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
      filterPathUrl={filterPathUrl}
      findApplicationDeploymentDetails={getApplicationDeploymentDetails}
      applicationDeploymentDetails={applicationDeploymentDetails}
      refreshApplicationDeployment={refreshCurrentApplicationDeployment}
      isRefreshingApplicationDeployment={isRefreshingApplicationDeployment}
      redeployWithVersion={redeployWithNewVersion}
      redeployWithCurrentVersion={redeployWithCurrent}
      redeployWithCurrentVersionResult={redeployWithCurrentVersionResult}
      findGroupedTagsPaged={getGroupedTagsPaged}
      findGroupedTagsPagedResult={findGroupedTagsPagedResult}
      findTagsPaged={getTagsPaged}
      findTagsPagedResponse={findTagsPagedResponse}
      redeployWithVersionResult={redeployWithVersionResult}
    />
  );

  return <Route render={DetailsView} />;
};

export default ApplicationDeploymentSelector;

const mapStateToProps = (state: RootState) => ({
  isRefreshingApplicationDeployment:
    state.affiliationViews.isRefreshingApplicationDeployment,
  redeployWithVersionResult: state.affiliationViews.redeployWithVersionResult,
  findGroupedTagsPagedResult: state.affiliationViews.findGroupedTagsPagedResult,
  applicationDeploymentDetails:
    state.affiliationViews.applicationDeploymentDetails
});

export const ApplicationDeploymentSelectorConnected = connect(
  mapStateToProps,
  {
    redeployWithNewVersion: (
      applicationDeploymentId: string,
      version: string
    ) => redeployWithVersion(applicationDeploymentId, version),
    refreshCurrentApplicationDeployment: (applicationDeploymentId: string) =>
      refreshApplicationDeployment(applicationDeploymentId),
    redeployWithCurrentVersion: (applicationDeploymentId: string) =>
      redeployWithCurrentVersion(applicationDeploymentId),
    getGroupedTagsPaged: (repository: string) =>
      findGroupedTagsPaged(repository),
    getTagsPaged: (
      repository: string,
      type: string,
      first?: number,
      cursor?: string
    ) => findTagsPaged(repository, type, first, cursor),
    getApplicationDeploymentDetails: (id: string) =>
      findApplicationDeploymentDetails(id)
  }
)(ApplicationDeploymentSelector);
