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
import { addErrors } from 'models/StateManager/state/actions';
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
  if (result && result.errors) {
    dispatch(addErrors(result.errors, result.name));
  }

  if (result && result.data) {
    dispatch(fetchSchemaResponse(result.data));
  } else {
    dispatch(fetchSchemaResponse({ databaseSchemas: [] }));
  }
};

export const updateSchema: Thunk = (
  databaseSchema: IUpdateDatabaseSchemaInputWithCreatedBy
) => async (dispatch, getState, { clients }) => {
  const result = await clients.databaseClient.updateSchema(databaseSchema);

  if (result && result.errors) {
    dispatch(addErrors(result.errors, result.name));
  }
  if (result && result.data && result.data.updateDatabaseSchema) {
    dispatch(updateSchemaResponse(true));
  } else {
    dispatch(updateSchemaResponse(false));
  }
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
  if (result && result.errors) {
    dispatch(addErrors(result.errors, result.name));
  }

  if (result && result.data) {
    dispatch(deleteSchemasResponse(result.data.deleteDatabaseSchemas));
    dispatch(fetchSchemas([databaseSchema.affiliation.name]));
  } else {
    dispatch(
      deleteSchemasResponse({
        failed: [],
        succeeded: []
      })
    );
    dispatch(fetchSchemas([databaseSchema.affiliation.name]));
  }
};

export const deleteSchemas: Thunk = (ids: string[]) => async (
  dispatch,
  getState,
  { clients }
) => {
  const result = await clients.databaseClient.deleteSchemas(ids);
  if (result && result.errors) {
    dispatch(addErrors(result.errors, result.name));
  }

  if (result && result.data) {
    dispatch(deleteSchemasResponse(result.data.deleteDatabaseSchemas));
  } else {
    dispatch(
      deleteSchemasResponse({
        failed: [],
        succeeded: []
      })
    );
  }
};

export const testJdbcConnectionForId: Thunk = (id: string) => async (
  dispatch,
  getState,
  { clients }
) => {
  const result = await clients.databaseClient.testJdbcConnectionForId(id);
  if (result && result.errors) {
    dispatch(addErrors(result.errors, result.name));
  }

  if (result && result.data) {
    dispatch(
      testJdbcConnectionForIdResponse(result.data.testJdbcConnectionForId)
    );
  } else {
    dispatch(testJdbcConnectionForIdResponse(false));
  }
};

export const testJdbcConnectionForJdbcUser: Thunk = (
  jdbcUser: IJdbcUser
) => async (dispatch, getState, { clients }) => {
  const result = await clients.databaseClient.testJdbcConnectionForJdbcUser(
    jdbcUser
  );
  if (result && result.errors) {
    dispatch(addErrors(result.errors, result.name));
  }

  if (result && result.data) {
    dispatch(
      testJdbcConnectionForJdbcUserResponse(
        result.data.testJdbcConnectionForJdbcUser
      )
    );
  } else {
    dispatch(testJdbcConnectionForJdbcUserResponse(false));
  }
};

export const createDatabaseSchema: Thunk = (
  databaseSchema: ICreateDatabaseSchemaInput
) => async (dispatch, getState, { clients }) => {
  const result = await clients.databaseClient.createDatabaseSchema(
    databaseSchema
  );

  if (result && result.errors) {
    dispatch(addErrors(result.errors, result.name));
  }

  if (result && result.data && result.data.createDatabaseSchema) {
    const graphqlResult = result.data.createDatabaseSchema;
    const response: ICreateDatabaseSchemaResponse = {
      id: graphqlResult.id,
      jdbcUser: {
        jdbcUrl: graphqlResult.jdbcUrl,
        password: graphqlResult.users[0].password,
        username: graphqlResult.users[0].username
      }
    };
    dispatch(createDatabaseSchemaResponse(response));
  } else {
    const response = {
      id: '',
      jdbcUser: { jdbcUrl: '', username: '', password: '' }
    };
    dispatch(createDatabaseSchemaResponse(response));
  }
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
