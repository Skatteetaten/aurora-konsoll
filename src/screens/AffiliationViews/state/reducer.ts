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
  redeployWithVersionResponse,
  applicationDeploymentDetailsResponse,
  redeployWithCurrentVersionResponse,
  findTagsPagedResponse,
  findGroupedTagsPagedResponse
} from './actions';
import { IUserSettings } from 'models/UserSettings';
import { ITagsPaged, ITagsPagedGroup, defaultTagsPagedGroup } from 'models/Tag';

export type AffiliationViewsAction = ActionType<typeof actions>;

export interface IAffiliationViewsState {
  readonly isRefreshingAffiliations: boolean;
  readonly isRefreshApplicationDeployment: boolean;
  readonly allApplicationDeploymentsResult: IApplicationDeployment[];
  readonly isFetchingAllApplicationDeployments: boolean;
  readonly userSettings: IUserSettings;
  readonly isUpdatingUserSettings: boolean;
  readonly isRefreshingApplicationDeployment: boolean;
  readonly redeployWithVersionResult: boolean;
  readonly redeployWithCurrentVersionResult: boolean;
  readonly applicationDeploymentDetails: IApplicationDeploymentDetails;
  readonly findTagsPagedResult: ITagsPaged;
  readonly findGroupedTagsPagedResult: ITagsPagedGroup;
}

const initialState = (): IAffiliationViewsState => {
  return {
    isRefreshingAffiliations: false,
    isRefreshApplicationDeployment: false,
    allApplicationDeploymentsResult: [],
    isFetchingAllApplicationDeployments: false,
    userSettings: { applicationDeploymentFilters: [] },
    isUpdatingUserSettings: false,
    isRefreshingApplicationDeployment: false,
    redeployWithVersionResult: false,
    redeployWithCurrentVersionResult: false,
    findGroupedTagsPagedResult: defaultTagsPagedGroup(),
    findTagsPagedResult: defaultTagsPagedGroup()[''],
    applicationDeploymentDetails: {
      pods: [],
      serviceLinks: []
    }
  };
};

function updateStateWithPayload(name: string) {
  return (
    state: IAffiliationViewsState,
    { payload }: AffiliationViewsAction
  ) => {
    state[name] = payload;
  };
}

export const affiliationViewsReducer = reduceReducers<IAffiliationViewsState>(
  [
    handleAction(
      refreshAffiliationsRequest,
      updateStateWithPayload('isRefreshingAffiliations')
    ),
    handleAction(
      refreshApplicationDeploymentRequest,
      updateStateWithPayload('isRefreshApplicationDeployment')
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
      redeployWithVersionResponse,
      updateStateWithPayload('redeployWithVersionResult')
    ),
    handleAction(
      applicationDeploymentDetailsResponse,
      updateStateWithPayload('applicationDeploymentDetails')
    ),
    handleAction(
      redeployWithCurrentVersionResponse,
      updateStateWithPayload('redeployWithCurrentVersionResult')
    ),
    handleAction(
      findTagsPagedResponse,
      updateStateWithPayload('findTagsPagedResult')
    ),
    handleAction(
      findGroupedTagsPagedResponse,
      updateStateWithPayload('findGroupedTagsPagedResult')
    )
  ],
  initialState()
);
