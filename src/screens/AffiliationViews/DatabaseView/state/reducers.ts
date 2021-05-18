import { ActionType } from 'typesafe-actions';
import actions, {
  createDatabaseSchemaResponse,
  deleteSchemaResponse,
  deleteSchemasResponse,
  fetchSchemaRequest,
  fetchNextSchemaRequest,
  fetchSchemaResponse,
  updateSchemaResponse,
  fetchInstanceResponse,
  fetchInstanceRequest,
  fetchRestorableSchemaResponse,
  fetchRestorableSchemaRequest,
  testJdbcConnectionForIdResponse,
  testJdbcConnectionForJdbcUserResponse,
  restoreSchemasResponse,
} from './actions';

import {
  ICreateDatabaseSchemaResponse,
  IChangeCooldownDatabaseSchemasResponse,
  IDatabaseInstances,
  IRestorableDatabaseSchemas,
  ITestJDBCResponse,
  IDatabaseSchemasWithPageInfo,
} from 'models/schemas';
import { createReducer } from '@reduxjs/toolkit';

export type DatabaseSchemasAction = ActionType<typeof actions>;

export interface ISchemasState {
  readonly isFetchingSchemas: boolean;
  readonly isFetchingNextSchemas: boolean;
  readonly databaseSchemas: IDatabaseSchemasWithPageInfo;
  readonly restorableDatabaseSchemas: IRestorableDatabaseSchemas;
  readonly isFetchingInstances: boolean;
  readonly databaseInstances: IDatabaseInstances;
  readonly updateSchemaResponse: boolean;
  readonly deleteSchemasResponse: IChangeCooldownDatabaseSchemasResponse;
  readonly restoreSchemasResponse: IChangeCooldownDatabaseSchemasResponse;
  readonly testJdbcConnectionResponse: ITestJDBCResponse;
  readonly createDatabaseSchemaResponse: ICreateDatabaseSchemaResponse;
  readonly isFetchingRestorableSchemas: boolean;
}

const initialState: ISchemasState = {
  isFetchingSchemas: false,
  isFetchingNextSchemas: false,
  databaseSchemas: {
    databaseSchemas: [],
    pageInfo: { endCursor: '', hasNextPage: false },
    totalCount: 0,
  },
  restorableDatabaseSchemas: { restorableDatabaseSchemas: [] },
  isFetchingInstances: false,
  databaseInstances: { databaseInstances: [] },
  updateSchemaResponse: false,
  deleteSchemasResponse: { failed: [], succeeded: [] },
  restoreSchemasResponse: { failed: [], succeeded: [] },
  testJdbcConnectionResponse: { hasSucceeded: false, message: 'failed' },
  createDatabaseSchemaResponse: {
    id: '',
    jdbcUser: { jdbcUrl: '', username: '', password: '' },
  },
  isFetchingRestorableSchemas: false,
};

function updateStateWithPayload(name: string) {
  return (state: ISchemasState, { payload }: DatabaseSchemasAction) => {
    state[name] = payload;
  };
}

export const databaseReducer = createReducer(initialState, (builder) => {
  builder.addCase(
    fetchSchemaRequest,
    updateStateWithPayload('isFetchingSchemas')
  );
  builder.addCase(
    fetchNextSchemaRequest,
    updateStateWithPayload('isFetchingNextSchemas')
  );
  builder.addCase(
    fetchSchemaResponse,
    updateStateWithPayload('databaseSchemas')
  );
  builder.addCase(
    fetchRestorableSchemaRequest,
    updateStateWithPayload('isFetchingRestorableSchemas')
  );
  builder.addCase(
    fetchRestorableSchemaResponse,
    updateStateWithPayload('restorableDatabaseSchemas')
  );
  builder.addCase(
    fetchInstanceRequest,
    updateStateWithPayload('isFetchingInstances')
  );
  builder.addCase(
    fetchInstanceResponse,
    updateStateWithPayload('databaseInstances')
  );
  builder.addCase(
    updateSchemaResponse,
    updateStateWithPayload('updateSchemaResponse')
  );
  builder.addCase(
    deleteSchemaResponse,
    updateStateWithPayload('deleteSchemasResponse')
  );
  builder.addCase(
    deleteSchemasResponse,
    updateStateWithPayload('deleteSchemasResponse')
  );
  builder.addCase(
    restoreSchemasResponse,
    updateStateWithPayload('restoreSchemasResponse')
  );
  builder.addCase(
    testJdbcConnectionForIdResponse,
    updateStateWithPayload('testJdbcConnectionResponse')
  );
  builder.addCase(
    testJdbcConnectionForJdbcUserResponse,
    updateStateWithPayload('testJdbcConnectionResponse')
  );
  builder.addCase(
    createDatabaseSchemaResponse,
    updateStateWithPayload('createDatabaseSchemaResponse')
  );
});
