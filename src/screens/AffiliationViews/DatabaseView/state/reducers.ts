import { ActionType } from 'typesafe-actions';
import actions, {
  createDatabaseSchemaResponse,
  deleteSchemaResponse,
  deleteSchemasResponse,
  fetchSchemaRequest,
  fetchSchemaResponse,
  testJdbcConnectionForIdResponse,
  testJdbcConnectionForJdbcUserResponse,
  updateSchemaResponse
} from './actions';

import {
  ICreateDatabaseSchemaResponse,
  IDatabaseSchemas,
  IDeleteDatabaseSchemasResponse
} from 'models/schemas';
import { handleAction, reduceReducers } from 'redux-ts-utils';

export type DatabaseSchemasAction = ActionType<typeof actions>;

export interface ISchemasState {
  readonly isFetchingSchemas?: boolean;
  readonly databaseSchemas?: IDatabaseSchemas;
  readonly updateSchemaResponse?: boolean;
  readonly deleteSchemasResponse?: IDeleteDatabaseSchemasResponse;
  readonly testJdbcConnectionResponse?: boolean;
  readonly createDatabaseSchemaResponse?: ICreateDatabaseSchemaResponse;
}

const initialState = () => {
  return {
    isFetchingSchemas: false,
    databaseSchemas: { databaseSchemas: [] },
    updateSchemaResponse: false,
    deleteSchemasResponse: { failed: [], succeeded: [] },
    testJdbcConnectionResponse: false,
    createDatabaseSchemaResponse: {
      id: '',
      jdbcUser: { jdbcUrl: '', username: '', password: '' }
    }
  };
};

export const databaseReducer = reduceReducers<ISchemasState>(
  [
    handleAction(fetchSchemaRequest, (state, { payload }) => {
      return { isFetchingSchemas: payload };
    }),
    handleAction(fetchSchemaResponse, (state, { payload }) => {
      return { databaseSchemas: payload.databaseSchemas };
    }),
    handleAction(updateSchemaResponse, (state, { payload }) => {
      return { updateSchemaResponse: payload };
    }),
    handleAction(deleteSchemaResponse, (state, { payload }) => {
      return { deleteSchemasResponse: payload };
    }),
    handleAction(deleteSchemasResponse, (state, { payload }) => {
      return { deleteSchemasResponse: payload };
    }),
    handleAction(testJdbcConnectionForIdResponse, (state, { payload }) => {
      return { testJdbcConnectionResponse: payload };
    }),
    handleAction(
      testJdbcConnectionForJdbcUserResponse,
      (state, { payload }) => {
        return { testJdbcConnectionResponse: payload };
      }
    ),
    handleAction(createDatabaseSchemaResponse, (state, { payload }) => {
      return { createDatabaseSchemaResponse: payload };
    })
  ],
  initialState()
);
