import { IApplicationDeployment } from 'models/ApplicationDeployment';
import { handleAction, reduceReducers } from 'redux-ts-utils';

import { ActionType } from 'typesafe-actions';
import actions, {
  findAllApplicationDeploymentsRequest,
  findAllApplicationDeploymentsResponse,
  refreshAffiliationsRequest
} from './actions';

export type AffiliationViewsAction = ActionType<typeof actions>;

export interface IAffiliationViewsState {
  readonly isRefreshingAffiliations: boolean;
  readonly allApplicationDeploymentsResult: IApplicationDeployment[];
  readonly isFetchingAllApplicationDeployments: boolean;
}

const initialState = (): IAffiliationViewsState => {
  return {
    isRefreshingAffiliations: false,
    allApplicationDeploymentsResult: [],
    isFetchingAllApplicationDeployments: false
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
      findAllApplicationDeploymentsResponse,
      updateStateWithPayload('allApplicationDeploymentsResult')
    ),
    handleAction(
      findAllApplicationDeploymentsRequest,
      updateStateWithPayload('isFetchingAllApplicationDeployments')
    )
  ],
  initialState()
);
