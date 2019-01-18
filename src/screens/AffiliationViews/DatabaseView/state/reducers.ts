import { combineReducers } from 'redux';
import { ActionType } from 'typesafe-actions';
import actions, {
  FETCHED_SCHEMA_REQUEST,
  FETCHED_SCHEMA_SUCCESS
} from './actions';

import { IDatabaseSchemas } from 'models/schemas';

export type DatabaseSchemasAction = ActionType<typeof actions>;

export interface ISchemasState {
  readonly isLoading: boolean;
  readonly items: IDatabaseSchemas;
}

export const databaseReducer = combineReducers<
  ISchemasState,
  DatabaseSchemasAction
>({
  isLoading: (state = false, action) => {
    switch (action.type) {
      case FETCHED_SCHEMA_REQUEST:
        return action.payload.isLoading;
      default:
        return state;
    }
  },
  items: (state = { databaseSchemas: [] }, action) => {
    switch (action.type) {
      case FETCHED_SCHEMA_SUCCESS:
        return action.payload.response;
      default:
        return state;
    }
  }
});
