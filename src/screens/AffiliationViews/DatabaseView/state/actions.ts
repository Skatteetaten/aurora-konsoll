import { ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';

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
import { createAction } from 'redux-ts-utils';

const databaseAction = (action: string) => `database/${action}`;

export const fetchSchemaRequest = createAction<boolean>(
  databaseAction('FETCHED_SCHEMA_REQUEST')
);
export const fetchSchemaResponse = createAction<IDatabaseSchemas>(
  databaseAction('FETCHED_SCHEMA_RESPONSE')
);
export const updateSchemaResponse = createAction<boolean>(
  databaseAction('UPDATE_SCHEMA_RESPONSE')
);
export const deleteSchemaResponse = createAction<
  IDeleteDatabaseSchemasResponse
>(databaseAction('DELETE_SCHEMA_RESPONSE'));

export const deleteSchemasResponse = createAction<
  IDeleteDatabaseSchemasResponse
>(databaseAction('DELETE_SCHEMAS_RESPONSE'));

export const testJdbcConnectionForIdResponse = createAction<boolean>(
  databaseAction('TEST_JDBC_CONNECTION_FOR_ID_RESPONSE')
);
export const testJdbcConnectionForJdbcUserResponse = createAction<boolean>(
  databaseAction('TEST_JDBC_CONNECTION_FOR_JDBCUSER_RESPONSE')
);
export const createDatabaseSchemaResponse = createAction<
  ICreateDatabaseSchemaResponse
>(databaseAction('CREATE_DATABASE_SCHEMA_RESPONSE'));

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
