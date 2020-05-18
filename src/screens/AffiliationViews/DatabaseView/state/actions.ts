import { Thunk } from 'store/types';

import {
  ICreateDatabaseSchemaInput,
  ICreateDatabaseSchemaResponse,
  IDatabaseSchema,
  IDatabaseSchemas,
  IDeleteDatabaseSchemasResponse,
  IJdbcUser,
  IUpdateDatabaseSchemaInputWithCreatedBy,
  IDatabaseInstances
} from 'models/schemas';
import { addCurrentErrors } from 'screens/ErrorHandler/state/actions';
import { createAction } from 'redux-ts-utils';

const databaseAction = (action: string) => `database/${action}`;

export const fetchRequest = createAction<boolean>(
  databaseAction('FETCH_REQUEST')
);
export const fetchSchemaResponse = createAction<IDatabaseSchemas>(
  databaseAction('FETCHED_SCHEMA_RESPONSE')
);
export const fetchRestorableSchemaResponse = createAction<IDatabaseSchemas>(
    databaseAction('FETCHED_RESTORABLE_SCHEMA_RESPONSE')
);
export const fetchInstanceResponse = createAction<IDatabaseInstances>(
  databaseAction('FETCHED_INSTANCE_RESPONSE')
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

export const fetchSchemas: Thunk = (affiliations: string[]) => async (
  dispatch,
  getState,
  { clients }
) => {
  dispatch(fetchRequest(true));
  const result = await clients.databaseClient.getSchemas(affiliations);
  dispatch(fetchRequest(false));
  dispatch(addCurrentErrors(result));

  if (result && result.data) {
    dispatch(fetchSchemaResponse(result.data));
  } else {
    dispatch(fetchSchemaResponse({ databaseSchemas: [] }));
  }
};

export const fetchRestorableSchemas: Thunk = (affiliation: string) => async (
  dispatch,
  getState,
  { clients }
) => {
  console.log("LJLKJ");
  dispatch(fetchRestorableSchemaResponse({ databaseSchemas: [] }));
};

export const fetchInstances: Thunk = (affiliation: string) => async (
  dispatch,
  getState,
  { clients }
) => {
  dispatch(fetchRequest(true));
  const result = await clients.databaseClient.getInstances(affiliation);
  dispatch(fetchRequest(false));
  dispatch(addCurrentErrors(result));

  if (result && result.data) {
    dispatch(fetchInstanceResponse(result.data));
  } else {
    dispatch(fetchInstanceResponse({ databaseInstances: [] }));
  }
};

export const updateSchema: Thunk = (
  databaseSchema: IUpdateDatabaseSchemaInputWithCreatedBy
) => async (dispatch, getState, { clients }) => {
  const result = await clients.databaseClient.updateSchema(databaseSchema);

  dispatch(addCurrentErrors(result));
  if (result && result.data && result.data.updateDatabaseSchema) {
    const update = !!(
      result &&
      result.data &&
      result.data.updateDatabaseSchema
    );
    dispatch(updateSchemaResponse(update));
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
  dispatch(addCurrentErrors(result));

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
  dispatch(addCurrentErrors(result));

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
  dispatch(addCurrentErrors(result));

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
  dispatch(addCurrentErrors(result));

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
  dispatch(addCurrentErrors(result));

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
  fetchInstanceResponse,
  fetchRequest,
  fetchSchemaResponse,
  updateSchemaResponse,
  deleteSchemasResponse,
  testJdbcConnectionForIdResponse,
  testJdbcConnectionForJdbcUserResponse,
  createDatabaseSchemaResponse
};

import actions, {
  createDatabaseSchemaResponse,
  deleteSchemaResponse,
  deleteSchemasResponse,
  fetchRequest,
  fetchSchemaResponse,
  testJdbcConnectionForIdResponse,
  testJdbcConnectionForJdbcUserResponse,
  updateSchemaResponse,
  fetchInstanceResponse,
  fetchRestorableSchemaResponse
} from './actions';
import {ActionType} from "typesafe-actions";
export type DatabaseSchemasAction = ActionType<typeof actions>;

