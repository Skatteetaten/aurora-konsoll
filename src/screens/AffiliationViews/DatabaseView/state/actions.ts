import { ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { action } from 'typesafe-actions';

import { IAuroraApiComponentProps } from 'components/AuroraApi';

import { RootAction, RootState } from 'store/types';

import {
  ICreateDatabaseSchemaInput,
  ICreateDatabaseSchemaResponse,
  IDatabaseSchema,
  IDatabaseSchemas,
  IDeleteDatabaseSchemasResponse,
  IJdbcUser,
  IUpdateDatabaseSchemaInputWithCreatedBy
} from 'models/schemas';

export const FETCHED_SCHEMA_REQUEST = 'database/FETCHED_SCHEMA_REQUEST';
export const FETCHED_SCHEMA_RESPONSE = 'database/FETCHED_SCHEMA_RESPONSE';

export const UPDATE_SCHEMA_RESPONSE = 'database/UPDATE_SCHEMA_RESPONSE';

export const DELETE_SCHEMA_RESPONSE = 'database/DELETE_SCHEMA_RESPONSE';
export const DELETE_SCHEMAS_RESPONSE = 'database/DELETE_SCHEMAS_RESPONSE';

export const TEST_JDBC_CONNECTION_FOR_ID_RESPONSE =
  'database/TEST_JDBC_CONNECTION_FOR_ID_RESPONSE';
export const TEST_JDBC_CONNECTION_FOR_JDBCUSER_RESPONSE =
  'database/TEST_JDBC_CONNECTION_FOR_JDBCUSER_RESPONSE';

export const CREATE_DATABASE_SCHEMA_RESPONSE =
  'database/CREATE_DATABASE_SCHEMA_RESPONSE';

export const fetchSchemaRequest = (isFetchingSchemas: boolean) =>
  action(FETCHED_SCHEMA_REQUEST, { isFetchingSchemas });
export const fetchSchemaResponse = (databaseSchemas: IDatabaseSchemas) =>
  action(FETCHED_SCHEMA_RESPONSE, { databaseSchemas });

export const updateSchemaResponse = (response: boolean) =>
  action(UPDATE_SCHEMA_RESPONSE, { response });

export const deleteSchemasResponse = (
  response: IDeleteDatabaseSchemasResponse
) => action(DELETE_SCHEMAS_RESPONSE, { response });

export const testJdbcConnectionForIdResponse = (response: boolean) =>
  action(TEST_JDBC_CONNECTION_FOR_ID_RESPONSE, { response });
export const testJdbcConnectionForJdbcUserResponse = (response: boolean) =>
  action(TEST_JDBC_CONNECTION_FOR_JDBCUSER_RESPONSE, { response });

export const createDatabaseSchemaResponse = (
  response: ICreateDatabaseSchemaResponse
) => action(CREATE_DATABASE_SCHEMA_RESPONSE, { response });

export type Thunk = ActionCreator<
  ThunkAction<void, RootState, IAuroraApiComponentProps, RootAction>
>;

export const fetchSchemas: Thunk = (affiliations: string[]) => async (
  dispatch,
  getState,
  { clients }
) => {
  dispatch(fetchSchemaRequest(true));
  const result = await clients.databaseClient.getSchemas(affiliations);
  dispatch(fetchSchemaRequest(false));
  dispatch(fetchSchemaResponse(result));
};

export const updateSchema: Thunk = (
  databaseSchema: IUpdateDatabaseSchemaInputWithCreatedBy
) => async (dispatch, getState, { clients }) => {
  const result = await clients.databaseClient.updateSchema(databaseSchema);
  dispatch(updateSchemaResponse(result));
  dispatch(fetchSchemas([databaseSchema.affiliation]));
};

export const deleteSchema: Thunk = (databaseSchema: IDatabaseSchema) => async (
  dispatch,
  getState,
  { clients }
) => {
  const result = await clients.databaseClient.deleteSchemas([
    databaseSchema.id
  ]);
  dispatch(deleteSchemasResponse(result));
  dispatch(fetchSchemas([databaseSchema.affiliation.name]));
};

export const deleteSchemas: Thunk = (ids: string[]) => async (
  dispatch,
  getState,
  { clients }
) => {
  const result = await clients.databaseClient.deleteSchemas(ids);
  dispatch(deleteSchemasResponse(result));
};

export const testJdbcConnectionForId: Thunk = (id: string) => async (
  dispatch,
  getState,
  { clients }
) => {
  const result = await clients.databaseClient.testJdbcConnectionForId(id);
  dispatch(testJdbcConnectionForIdResponse(result));
};

export const testJdbcConnectionForJdbcUser: Thunk = (
  jdbcUser: IJdbcUser
) => async (dispatch, getState, { clients }) => {
  const result = await clients.databaseClient.testJdbcConnectionForJdbcUser(
    jdbcUser
  );
  dispatch(testJdbcConnectionForJdbcUserResponse(result));
};

export const createDatabaseSchema: Thunk = (
  databaseSchema: ICreateDatabaseSchemaInput
) => async (dispatch, getState, { clients }) => {
  const result = await clients.databaseClient.createDatabaseSchema(
    databaseSchema
  );
  dispatch(createDatabaseSchemaResponse(result));
};

export default {
  fetchSchemaRequest,
  fetchSchemaResponse,
  updateSchemaResponse,
  deleteSchemasResponse,
  testJdbcConnectionForIdResponse,
  testJdbcConnectionForJdbcUserResponse,
  createDatabaseSchemaResponse
};
