import { ActionType } from 'typesafe-actions';
import actions, {
  createDatabaseSchemaResponse,
  deleteSchemaResponse,
  deleteSchemasResponse,
  fetchSchemaRequest,
  fetchSchemaResponse,
  testJdbcConnectionForIdResponse,
  testJdbcConnectionForJdbcUserResponse,
  updateSchemaResponse,
  fetchInstanceResponse,
  fetchInstanceRequest
} from './actions';

import {
  ICreateDatabaseSchemaResponse,
  IDatabaseSchemas,
  IDeleteDatabaseSchemasResponse,
  IDatabaseInstances
} from 'models/schemas';
import { handleAction, reduceReducers } from 'redux-ts-utils';

export type DatabaseSchemasAction = ActionType<typeof actions>;

export interface ISchemasState {
  readonly isFetchingSchemas: boolean;
  readonly databaseSchemas: IDatabaseSchemas;
  readonly isFetchingInstances: boolean;
  readonly databaseInstances: IDatabaseInstances;
  readonly updateSchemaResponse: boolean;
  readonly deleteSchemasResponse: IDeleteDatabaseSchemasResponse;
  readonly testJdbcConnectionResponse: boolean;
  readonly createDatabaseSchemaResponse: ICreateDatabaseSchemaResponse;
}

const initialState = (): ISchemasState => {
  return {
    isFetchingSchemas: false,
    databaseSchemas: { databaseSchemas: [] },
    isFetchingInstances: false,
    databaseInstances: { databaseInstances: [] },
    updateSchemaResponse: false,
    deleteSchemasResponse: { failed: [], succeeded: [] },
    testJdbcConnectionResponse: false,
    createDatabaseSchemaResponse: {
      id: '',
      jdbcUser: { jdbcUrl: '', username: '', password: '' }
    }
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
      fetchSchemaResponse,
      updateStateWithPayload('databaseSchemas')
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
    )
  ],
  initialState()
);
