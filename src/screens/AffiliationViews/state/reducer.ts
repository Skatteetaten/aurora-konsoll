import {
  IApplicationDeployment,
  IApplicationDeploymentDetails
} from 'models/ApplicationDeployment';
import { handleAction, reduceReducers } from 'redux-ts-utils';

import { ActionType } from 'typesafe-actions';
import actions, {
  findAllApplicationDeploymentsRequest,
  findAllApplicationDeploymentsResponse,
  refreshAffiliationsRequest,
  refreshApplicationDeploymentRequest,
  userSettingsResponse,
  updateUserSettingsRequest,
  refreshApplicationDeploymentResponse,
  applicationDeploymentDetailsResponse,
  findTagsPagedResponse,
  findGroupedTagsPagedResponse,
  redeployRequest,
  fetchDetailsRequest,
  fetchTagsRequest,
  fetchGroupedTagsRequest
} from './actions';
import { IUserSettings } from 'models/UserSettings';
import { ITagsPaged, ITagsPagedGroup, defaultTagsPagedGroup } from 'models/Tag';

export type AffiliationViewAction = ActionType<typeof actions>;

export interface IAffiliationViewState {
  readonly isRefreshingAffiliations: boolean;
  readonly allApplicationDeploymentsResult: IApplicationDeployment[];
  readonly isFetchingAllApplicationDeployments: boolean;
  readonly isFetchingTags: boolean;
  readonly isFetchingGroupedTags: boolean;
  readonly userSettings: IUserSettings;
  readonly isUpdatingUserSettings: boolean;
  readonly isRefreshingApplicationDeployment: boolean;
  readonly isRedeploying: boolean;
  readonly applicationDeploymentDetails: IApplicationDeploymentDetails;
  readonly isFetchingDetails: boolean;
  readonly findTagsPagedResult: ITagsPaged;
  readonly findGroupedTagsPagedResult: ITagsPagedGroup;
}

const initialState = (): IAffiliationViewState => {
  return {
    isRefreshingAffiliations: false,
    isFetchingTags: false,
    isFetchingGroupedTags: false,
    allApplicationDeploymentsResult: [],
    isFetchingAllApplicationDeployments: false,
    userSettings: { applicationDeploymentFilters: [] },
    isUpdatingUserSettings: false,
    isRefreshingApplicationDeployment: false,
    isRedeploying: false,
    findGroupedTagsPagedResult: defaultTagsPagedGroup(),
    findTagsPagedResult: defaultTagsPagedGroup()[''],
    isFetchingDetails: false,
    applicationDeploymentDetails: {
      pods: [],
      serviceLinks: []
    }
  };
};

function updateStateWithPayload(name: string) {
  return (state: IAffiliationViewState, { payload }: AffiliationViewAction) => {
    state[name] = payload;
  };
}

export const affiliationViewReducer = reduceReducers<IAffiliationViewState>(
  [
    handleAction(
      refreshAffiliationsRequest,
      updateStateWithPayload('isRefreshingAffiliations')
    ),
    handleAction(
      refreshApplicationDeploymentRequest,
      updateStateWithPayload('isRefreshingApplicationDeployment')
    ),
    handleAction(
      findAllApplicationDeploymentsResponse,
      updateStateWithPayload('allApplicationDeploymentsResult')
    ),
    handleAction(
      findAllApplicationDeploymentsRequest,
      updateStateWithPayload('isFetchingAllApplicationDeployments')
    ),
    handleAction(userSettingsResponse, updateStateWithPayload('userSettings')),
    handleAction(
      updateUserSettingsRequest,
      updateStateWithPayload('isUpdatingUserSettings')
    ),
    handleAction(
      refreshApplicationDeploymentResponse,
      updateStateWithPayload('isRefreshingApplicationDeployment')
    ),
    handleAction(
      applicationDeploymentDetailsResponse,
      updateStateWithPayload('applicationDeploymentDetails')
    ),
    handleAction(redeployRequest, updateStateWithPayload('isRedeploying')),
    handleAction(
      findTagsPagedResponse,
      updateStateWithPayload('findTagsPagedResult')
    ),
    handleAction(
      findGroupedTagsPagedResponse,
      updateStateWithPayload('findGroupedTagsPagedResult')
    ),
    handleAction(fetchTagsRequest, updateStateWithPayload('isFetchingTags')),
    handleAction(
      fetchGroupedTagsRequest,
      updateStateWithPayload('isFetchingGroupedTags')
    ),
    handleAction(
      fetchDetailsRequest,
      updateStateWithPayload('isFetchingDetails')
    )
  ],
  initialState()
);
