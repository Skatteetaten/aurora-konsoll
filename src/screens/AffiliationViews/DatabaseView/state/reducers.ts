import { combineReducers } from 'redux';
import { ActionType } from 'typesafe-actions';
import actions, {
  FETCHED_SCHEMA_REQUEST,
  FETCHED_SCHEMA_SUCCESS,
  UPDATE_SCHEMA_REQUEST,
  UPDATE_SCHEMA_SUCCESS
} from './actions';

import { IDatabaseSchemas } from 'models/schemas';

export type DatabaseSchemasAction = ActionType<typeof actions>;

export interface ISchemasState {
  readonly isFetchingSchemas: boolean;
  readonly isUpdatingSchema: boolean;
  readonly databaseSchemas: IDatabaseSchemas;
  readonly updateSchemaResponse: boolean;
}

export const databaseReducer = combineReducers<
  ISchemasState,
  DatabaseSchemasAction
>({
  isFetchingSchemas: (state = false, action) => {
    switch (action.type) {
      case FETCHED_SCHEMA_REQUEST:
        return action.payload.isFetchingSchemas;
      default:
        return state;
    }
  },
  databaseSchemas: (state = { databaseSchemas: [] }, action) => {
    switch (action.type) {
      case FETCHED_SCHEMA_SUCCESS:
        return action.payload.databaseSchemas;
      default:
        return state;
    }
  },
  isUpdatingSchema: (state = false, action) => {
    switch (action.type) {
      case UPDATE_SCHEMA_REQUEST:
        return action.payload.isUpdatingSchema;
      default:
        return state;
    }
  },
  updateSchemaResponse: (state = false, action) => {
    switch (action.type) {
      case UPDATE_SCHEMA_SUCCESS:
        return action.payload.updateSchemaResponse;
      default:
        return state;
    }
  }
});
