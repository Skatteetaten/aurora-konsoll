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
  refreshApplicationDeployment
} from './state/actions';

interface IApplicationDeploymentSelectorConnectedProps {
  redeployWithNewVersion: (
    applicationDeploymentId: string,
    version: string
  ) => boolean;
  refreshCurrentApplicationDeployment: (
    applicationDeploymentId: string
  ) => boolean;
  redeployWithCurrent: (applicationDeploymentId: string) => boolean;
  getGroupedTagsPaged: (repository: string) => ITagsPagedGroup;
  getTagsPaged: (
    repository: string,
    type: string,
    first?: number,
    cursor?: string
  ) => ITagsPaged;
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
  findApplicationDeploymentDetails,
  refreshCurrentApplicationDeployment,
  redeployWithNewVersion,
  redeployWithCurrent,
  getGroupedTagsPaged,
  getTagsPaged
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
      findApplicationDeploymentDetails={findApplicationDeploymentDetails}
      refreshApplicationDeployment={refreshCurrentApplicationDeployment}
      redeployWithVersion={redeployWithNewVersion}
      redeployWithCurrentVersion={redeployWithCurrent}
      findGroupedTagsPaged={getGroupedTagsPaged}
      findTagsPaged={getTagsPaged}
    />
  );

  return <Route render={DetailsView} />;
};

export default ApplicationDeploymentSelector;

const mapStateToProps = (state: RootState) => ({});

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
    ) => findTagsPaged(repository, type, first, cursor)
  }
)(ApplicationDeploymentSelector);
