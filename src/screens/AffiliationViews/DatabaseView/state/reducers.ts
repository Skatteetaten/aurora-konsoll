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
import { handleAction, reduceReducers } from 'redux-ts-utils';

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

const initialState = (): ISchemasState => {
  return {
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
};

function updateStateWithPayload(name: string) {
  return (state: ISchemasState, { payload }: DatabaseSchemasAction) => {
    state[name] = payload;
  };
}

export const databaseReducer = reduceReducers<ISchemasState>(
  [
    handleAction(
      fetchSchemaRequest,
      updateStateWithPayload('isFetchingSchemas')
    ),
    handleAction(
      fetchNextSchemaRequest,
      updateStateWithPayload('isFetchingNextSchemas')
    ),
    handleAction(
      fetchSchemaResponse,
      updateStateWithPayload('databaseSchemas')
    ),
    handleAction(
      fetchRestorableSchemaRequest,
      updateStateWithPayload('isFetchingRestorableSchemas')
    ),
    handleAction(
      fetchRestorableSchemaResponse,
      updateStateWithPayload('restorableDatabaseSchemas')
    ),
    handleAction(
      fetchInstanceRequest,
      updateStateWithPayload('isFetchingInstances')
    ),
    handleAction(
      fetchInstanceResponse,
      updateStateWithPayload('databaseInstances')
    ),
    handleAction(
      updateSchemaResponse,
      updateStateWithPayload('updateSchemaResponse')
    ),
    handleAction(
      deleteSchemaResponse,
      updateStateWithPayload('deleteSchemasResponse')
    ),
    handleAction(
      deleteSchemasResponse,
      updateStateWithPayload('deleteSchemasResponse')
    ),
    handleAction(
      restoreSchemasResponse,
      updateStateWithPayload('restoreSchemasResponse')
    ),
    handleAction(
      testJdbcConnectionForIdResponse,
      updateStateWithPayload('testJdbcConnectionResponse')
    ),
    handleAction(
      testJdbcConnectionForJdbcUserResponse,
      updateStateWithPayload('testJdbcConnectionResponse')
    ),
    handleAction(
      createDatabaseSchemaResponse,
      updateStateWithPayload('createDatabaseSchemaResponse')
    ),
  ],
  initialState()
);
