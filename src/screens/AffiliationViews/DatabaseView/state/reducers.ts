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
  readonly isFetchingSchemas: boolean;
  readonly databaseSchemas: IDatabaseSchemas;
  readonly updateSchemaResponse: boolean;
  readonly deleteSchemasResponse: IDeleteDatabaseSchemasResponse;
  readonly testJdbcConnectionResponse: boolean;
  readonly createDatabaseSchemaResponse: ICreateDatabaseSchemaResponse;
}

const initialState = (): ISchemasState => {
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
