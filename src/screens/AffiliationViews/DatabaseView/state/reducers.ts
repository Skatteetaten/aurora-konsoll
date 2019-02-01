import { combineReducers } from 'redux';
import { ActionType } from 'typesafe-actions';
import actions, {
  DELETE_SCHEMA_RESPONSE,
  FETCHED_SCHEMA_REQUEST,
  FETCHED_SCHEMA_RESPONSE,
  TEST_JDBC_CONNECTION_FOR_ID_RESPONSE,
  TEST_JDBC_CONNECTION_FOR_JDBCUSER_RESPONSE,
  UPDATE_SCHEMA_RESPONSE
} from './actions';

import { IDatabaseSchemas } from 'models/schemas';

export type DatabaseSchemasAction = ActionType<typeof actions>;

export interface ISchemasState {
  readonly isFetchingSchemas: boolean;
  readonly databaseSchemas: IDatabaseSchemas;
  readonly updateSchemaResponse: boolean;
  readonly deleteSchemaResponse: boolean;
  readonly testJdbcConnectionForIdResponse: boolean;
  readonly testJdbcConnectionForJdbcUserResponse: boolean;
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
      case FETCHED_SCHEMA_RESPONSE:
        return action.payload.databaseSchemas;
      default:
        return state;
    }
  },
  updateSchemaResponse: (state = false, action) => {
    switch (action.type) {
      case UPDATE_SCHEMA_RESPONSE:
        return action.payload.response;
      default:
        return state;
    }
  },
  deleteSchemaResponse: (state = false, action) => {
    switch (action.type) {
      case DELETE_SCHEMA_RESPONSE:
        return action.payload.response;
      default:
        return state;
    }
  },
  testJdbcConnectionForIdResponse: (state = false, action) => {
    switch (action.type) {
      case TEST_JDBC_CONNECTION_FOR_ID_RESPONSE:
        return action.payload.response;
      default:
        return state;
    }
  },
  testJdbcConnectionForJdbcUserResponse: (state = false, action) => {
    switch (action.type) {
      case TEST_JDBC_CONNECTION_FOR_JDBCUSER_RESPONSE:
        return action.payload.response;
      default:
        return state;
    }
  }
});
