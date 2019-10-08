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
  findApplicationDeploymentDetails,
  findAllApplicationDeployments,
  findNewTagsPaged,
  searchTagsPaged
} from './state/actions';
import { IApplicationDeploymentDetails } from 'models/ApplicationDeployment';
import { ImageTagType } from 'models/ImageTagType';

interface IApplicationDeploymentSelectorConnectedProps {
  redeployWithNewVersion: (
    applicationDeploymentId: string,
    version: string,
    affiliation: string,
    id: string,
    setInitialTagTypeTrue: () => void
  ) => void;
  refreshCurrentApplicationDeployment: (
    applicationDeploymentId: string,
    affiliation: string
  ) => void;
  redeployWithCurrent: (
    applicationDeploymentId: string,
    affiliation: string,
    id: string
  ) => void;
  getGroupedTagsPaged: (
    repository: string,
    setTagsPagedGroup: (tagsPagedGroup: ITagsPagedGroup) => void
  ) => void;
  searchTagsPaged: (
    repository: string,
    updateTagsPaged: (next?: ITagsPaged, newTags?: ITagsPaged) => void,
    first: number,
    current: ITagsPaged,
    filter: string
  ) => void;
  getTagsPaged: (
    repository: string,
    type: ImageTagType,
    updateTagsPaged: (
      type: ImageTagType,
      next?: ITagsPaged,
      newTags?: ITagsPaged
    ) => void,
    first: number,
    current: ITagsPaged
  ) => void;
  getNewTagsPaged: (
    repository: string,
    type: ImageTagType,
    updateTagsPaged: (
      type: ImageTagType,
      next?: ITagsPaged,
      newTags?: ITagsPaged
    ) => void,
    current: ITagsPaged
  ) => void;
  getAllApplicationDeployments: (affiliation: string) => void;
  getApplicationDeploymentDetails: (id: string) => void;
  findTagsPagedResponse: ITagsPaged;
  findGroupedTagsPagedResult: ITagsPagedGroup;
  isFetchingTags: boolean;
  isFetchingGroupedTags: boolean;
  isRefreshingApplicationDeployment: boolean;
  isRedeploying: boolean;
  isFetchingDetails: boolean;
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
  getAllApplicationDeployments,
  match,
  filterPathUrl,
  getApplicationDeploymentDetails,
  applicationDeploymentDetails,
  refreshCurrentApplicationDeployment,
  redeployWithNewVersion,
  redeployWithCurrent,
  isRedeploying,
  getGroupedTagsPaged,
  getTagsPaged,
  getNewTagsPaged,
  findTagsPagedResponse,
  isFetchingTags,
  isFetchingGroupedTags,
  isFetchingDetails,
  findGroupedTagsPagedResult,
  isRefreshingApplicationDeployment,
  affiliation,
  searchTagsPaged
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
      getAllApplicationDeployments={getAllApplicationDeployments}
      filterPathUrl={filterPathUrl}
      findApplicationDeploymentDetails={getApplicationDeploymentDetails}
      deploymentDetails={applicationDeploymentDetails}
      refreshApplicationDeployment={refreshCurrentApplicationDeployment}
      isRefreshingApplicationDeployment={isRefreshingApplicationDeployment}
      redeployWithVersion={redeployWithNewVersion}
      redeployWithCurrentVersion={redeployWithCurrent}
      isRedeploying={isRedeploying}
      findGroupedTagsPaged={getGroupedTagsPaged}
      findGroupedTagsPagedResult={findGroupedTagsPagedResult}
      searchTagsPaged={searchTagsPaged}
      findTagsPaged={getTagsPaged}
      findNewTagsPaged={getNewTagsPaged}
      findTagsPagedResponse={findTagsPagedResponse}
      affiliation={affiliation}
      isFetchingTags={isFetchingTags}
      isFetchingGroupedTags={isFetchingGroupedTags}
      isFetchingDetails={isFetchingDetails}
    />
  );

  return <Route render={DetailsView} />;
};

export default ApplicationDeploymentSelector;

const mapStateToProps = (state: RootState) => ({
  isRefreshingApplicationDeployment:
    state.affiliationView.isRefreshingApplicationDeployment,
  findGroupedTagsPagedResult: state.affiliationView.findGroupedTagsPagedResult,
  applicationDeploymentDetails:
    state.affiliationView.applicationDeploymentDetails,
  isRedeploying: state.affiliationView.isRedeploying,
  isFetchingTags: state.affiliationView.isFetchingTags,
  isFetchingGroupedTags: state.affiliationView.isFetchingGroupedTags,
  isFetchingDetails: state.affiliationView.isFetchingDetails
});

export const ApplicationDeploymentSelectorConnected = connect(
  mapStateToProps,
  {
    redeployWithNewVersion: (
      applicationDeploymentId: string,
      version: string,
      affiliation: string,
      id: string,
      setInitialTagTypeTrue: () => void
    ) =>
      redeployWithVersion(
        applicationDeploymentId,
        version,
        affiliation,
        id,
        setInitialTagTypeTrue
      ),
    refreshCurrentApplicationDeployment: (
      applicationDeploymentId: string,
      affiliation: string
    ) => refreshApplicationDeployment(applicationDeploymentId, affiliation),
    redeployWithCurrent: (
      applicationDeploymentId: string,
      affiliation: string,
      id: string
    ) => redeployWithCurrentVersion(applicationDeploymentId, affiliation, id),
    getGroupedTagsPaged: (
      repository: string,
      setTagsPagedGroup: (tagsPagedGroup: ITagsPagedGroup) => void
    ) => findGroupedTagsPaged(repository, setTagsPagedGroup),
    getTagsPaged: (
      repository: string,
      type: ImageTagType,
      updateTagsPaged: (
        type: ImageTagType,
        next?: ITagsPaged,
        newTags?: ITagsPaged
      ) => void,
      first: number,
      current: ITagsPaged
    ) => findTagsPaged(repository, type, updateTagsPaged, first, current),
    searchTagsPaged: (
      repository: string,
      updateTagsPaged: (next?: ITagsPaged, newTags?: ITagsPaged) => void,
      first: number,
      current: ITagsPaged,
      filter: string
    ) => {
      return searchTagsPaged(
        repository,
        updateTagsPaged,
        first,
        current,
        filter
      );
    },
    getNewTagsPaged: (
      repository: string,
      type: ImageTagType,
      updateTagsPaged: (
        type: ImageTagType,
        next?: ITagsPaged,
        newTags?: ITagsPaged
      ) => void,
      current: ITagsPaged
    ) => findNewTagsPaged(repository, type, updateTagsPaged, current),
    getApplicationDeploymentDetails: (id: string) =>
      findApplicationDeploymentDetails(id),
    getAllApplicationDeployments: (affiliation: string) =>
      findAllApplicationDeployments([affiliation])
  }
)(ApplicationDeploymentSelector);
