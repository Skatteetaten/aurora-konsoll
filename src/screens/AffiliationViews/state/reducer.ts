import { handleAction, reduceReducers } from 'redux-ts-utils';
import { ActionType } from 'typesafe-actions';
import actions, { refreshAffiliationsResponse } from './actions';

export type AffiliationViewsAction = ActionType<typeof actions>;

export interface IAffiliationViewsState {
  readonly isRefreshingAffiliations: boolean;
}

const initialState = (): IAffiliationViewsState => {
  return {
    isRefreshingAffiliations: false
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
      refreshAffiliationsResponse,
      updateStateWithPayload('isRefreshingAffiliations')
    )
  ],
  initialState()
);
