import { Thunk } from 'store/types';

import {
  ICreateDatabaseSchemaInput,
  ICreateDatabaseSchemaResponse,
  IDatabaseSchema,
  IDatabaseSchemas,
  IChangeCooldownDatabaseSchemasResponse,
  IJdbcUser,
  IUpdateDatabaseSchemaInputWithCreatedBy,
  IDatabaseInstances,
  ITestJDBCResponse,
  IRestorableDatabaseSchemas
} from 'models/schemas';
import { addCurrentErrors } from 'screens/ErrorHandler/state/actions';
import { createAction } from 'redux-ts-utils';

const databaseAction = (action: string) => `database/${action}`;

export const fetchSchemaRequest = createAction<boolean>(
  databaseAction('FETCHED_SCHEMA_REQUEST')
);
export const fetchInstanceRequest = createAction<boolean>(
  databaseAction('FETCHED_INSTANCE_REQUEST')
);
export const fetchSchemaResponse = createAction<IDatabaseSchemas>(
  databaseAction('FETCHED_SCHEMA_RESPONSE')
);
export const fetchRestorableSchemaRequest = createAction<boolean>(
  databaseAction('FETCHED_RESTORABLE_SCHEMA_REQUEST')
);
export const fetchRestorableSchemaResponse = createAction<
  IRestorableDatabaseSchemas
>(databaseAction('FETCHED_RESTORABLE_SCHEMA_RESPONSE'));
export const fetchInstanceResponse = createAction<IDatabaseInstances>(
  databaseAction('FETCHED_INSTANCE_RESPONSE')
);
export const updateSchemaResponse = createAction<boolean>(
  databaseAction('UPDATE_SCHEMA_RESPONSE')
);
export const deleteSchemaResponse = createAction<
  IChangeCooldownDatabaseSchemasResponse
>(databaseAction('DELETE_SCHEMA_RESPONSE'));

export const deleteSchemasResponse = createAction<
  IChangeCooldownDatabaseSchemasResponse
>(databaseAction('DELETE_SCHEMAS_RESPONSE'));

export const restoreSchemasResponse = createAction<
  IChangeCooldownDatabaseSchemasResponse
>(databaseAction('RESTORE_SCHEMAS_RESPONSE'));

export const testJdbcConnectionForIdResponse = createAction<ITestJDBCResponse>(
  databaseAction('TEST_JDBC_CONNECTION_FOR_ID_RESPONSE')
);
export const testJdbcConnectionForJdbcUserResponse = createAction<
  ITestJDBCResponse
>(databaseAction('TEST_JDBC_CONNECTION_FOR_JDBCUSER_RESPONSE'));
export const createDatabaseSchemaResponse = createAction<
  ICreateDatabaseSchemaResponse
>(databaseAction('CREATE_DATABASE_SCHEMA_RESPONSE'));

export const fetchSchemas: Thunk = (affiliations: string[]) => async (
  dispatch,
  getState,
  { clients }
) => {
  dispatch(fetchSchemaRequest(true));
  const result = await clients.databaseClient.getSchemas(affiliations);
  dispatch(fetchSchemaRequest(false));
  dispatch(addCurrentErrors(result));

  if (result && result.data) {
    dispatch(fetchSchemaResponse(result.data));
  } else {
    dispatch(fetchSchemaResponse({ databaseSchemas: [] }));
  }
};

export const fetchRestorableSchemas: Thunk = (affiliations: string[]) => async (
  dispatch,
  getState,
  { clients }
) => {
  dispatch(fetchRestorableSchemaRequest(true));
  const result = await clients.databaseClient.getRestorableSchemas(
    affiliations
  );
  dispatch(fetchRestorableSchemaRequest(false));
  dispatch(addCurrentErrors(result));
  if (result && result.data) {
    dispatch(fetchRestorableSchemaResponse(result.data));
  } else {
    dispatch(fetchRestorableSchemaResponse({ restorableDatabaseSchemas: [] }));
  }
};

export const fetchInstances: Thunk = (affiliation: string) => async (
  dispatch,
  getState,
  { clients }
) => {
  dispatch(fetchInstanceRequest(true));
  const result = await clients.databaseClient.getInstances(affiliation);
  dispatch(fetchInstanceRequest(false));
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

export const restoreSchema: Thunk = (
  databaseSchema: IDatabaseSchema,
  active: boolean
) => async (dispatch, getState, { clients }) => {
  const result = await clients.databaseClient.restoreSchemas(
    [databaseSchema.id],
    active
  );
  dispatch(addCurrentErrors(result));

  if (result && result.data) {
    dispatch(restoreSchemasResponse(result.data.restoreDatabaseSchemas));
    dispatch(fetchRestorableSchemas([databaseSchema.affiliation.name]));
  } else {
    dispatch(
      restoreSchemasResponse({
        failed: [],
        succeeded: []
      })
    );
    dispatch(fetchSchemas([databaseSchema.affiliation.name]));
  }
};

export const restoreSchemas: Thunk = (ids: string[], active: boolean) => async (
  dispatch,
  getState,
  { clients }
) => {
  const result = await clients.databaseClient.restoreSchemas(ids, active);
  dispatch(addCurrentErrors(result));

  if (result && result.data) {
    dispatch(restoreSchemasResponse(result.data.restoreDatabaseSchemas));
  } else {
    dispatch(
      restoreSchemasResponse({
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
    dispatch(
      testJdbcConnectionForIdResponse({
        hasSucceeded: false,
        message: 'failed'
      })
    );
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
    dispatch(
      testJdbcConnectionForIdResponse({
        hasSucceeded: false,
        message: 'failed'
      })
    );
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
  fetchInstanceRequest,
  fetchSchemaRequest,
  fetchSchemaResponse,
  fetchRestorableSchemaResponse,
  updateSchemaResponse,
  deleteSchemasResponse,
  restoreSchemasResponse,
  testJdbcConnectionForIdResponse,
  testJdbcConnectionForJdbcUserResponse,
  createDatabaseSchemaResponse
};
