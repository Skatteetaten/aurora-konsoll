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
  refreshApplicationDeploymentResponse,
  applicationDeploymentDetailsResponse,
  fetchDetailsRequest,
  deleteApplicationDeploymentResponse
} from './actions';
import { IUserSettings } from 'models/UserSettings';

export type AffiliationViewAction = ActionType<typeof actions>;

export interface IAffiliationViewState {
  readonly isRefreshingAffiliations: boolean;
  readonly allApplicationDeploymentsResult: IApplicationDeployment[];
  readonly isFetchingAllApplicationDeployments: boolean;
  readonly userSettings: IUserSettings;
  readonly isUpdatingUserSettings: boolean;
  readonly isRefreshingApplicationDeployment: boolean;
  readonly applicationDeploymentDetails: IApplicationDeploymentDetails;
  readonly isFetchingDetails: boolean;
  readonly isApplicationDeploymentDeleted: boolean;
}

const initialState = (): IAffiliationViewState => {
  return {
    isRefreshingAffiliations: false,
    allApplicationDeploymentsResult: [],
    isFetchingAllApplicationDeployments: false,
    userSettings: { applicationDeploymentFilters: [] },
    isUpdatingUserSettings: false,
    isRefreshingApplicationDeployment: false,
    isFetchingDetails: false,
    applicationDeploymentDetails: {
      pods: [],
      serviceLinks: []
    },
    isApplicationDeploymentDeleted: false
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
    handleAction(
      refreshApplicationDeploymentResponse,
      updateStateWithPayload('isRefreshingApplicationDeployment')
    ),
    handleAction(
      applicationDeploymentDetailsResponse,
      updateStateWithPayload('applicationDeploymentDetails')
    ),
    handleAction(
      fetchDetailsRequest,
      updateStateWithPayload('isFetchingDetails')
    ),
    handleAction(
      deleteApplicationDeploymentResponse,
      updateStateWithPayload('isApplicationDeploymentDeleted')
    )
  ],
  initialState()
);
