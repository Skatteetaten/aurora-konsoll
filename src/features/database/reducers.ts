import { combineReducers } from 'redux';
import { ActionType } from 'typesafe-actions';
import * as actions from './actions';

import { INetdebugResult } from 'services/auroraApiClients';

import {
  FETCHED_SCHEMA_FAILURE,
  FETCHED_SCHEMA_REQUEST,
  FETCHED_SCHEMA_SUCCESS
} from './constants';

export type SchemasAction = ActionType<typeof actions>;

export interface IDatabaseState {
  readonly isLoading: boolean;
  readonly items?: INetdebugResult | null;
  readonly hasErrored: boolean;
}

export default combineReducers<IDatabaseState, SchemasAction>({
  isLoading: (state = false, action) => {
    switch (action.type) {
      case FETCHED_SCHEMA_REQUEST:
        return action.payload.isLoading;
      default:
        return state;
    }
  },
  items: (state = null, action) => {
    switch (action.type) {
      case FETCHED_SCHEMA_SUCCESS:
        return action.payload.response;
      default:
        return state;
    }
  },
  hasErrored: (state = false, action) => {
    switch (action.type) {
      case FETCHED_SCHEMA_FAILURE:
        return action.payload.errorMessage;
      default:
        return state;
    }
  }
});
