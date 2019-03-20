import {
  createDatabaseSchemaResponseFactory,
  databaseSchemasFactory,
  deleteDatabaseSchemasResponseFactory,
  schemasFactory
} from 'testData/testDataBuilders';
import {
  createDatabaseSchemaResponse,
  deleteSchemaResponse,
  deleteSchemasResponse,
  fetchSchemaRequest,
  fetchSchemaResponse,
  testJdbcConnectionForIdResponse,
  testJdbcConnectionForJdbcUserResponse,
  updateSchemaResponse
} from './actions';
import { databaseReducer } from './reducers';

describe('database schema actions', () => {
  it('should return type of action fetchSchemaRequest and payload', () => {
    expect(fetchSchemaRequest(true)).toEqual({
      payload: true,
      type: 'database/FETCHED_SCHEMA_REQUEST'
    });
  });

  it('should return type of action fetchSchemaResponse and payload', () => {
    expect(fetchSchemaResponse(databaseSchemasFactory.build())).toEqual({
      payload: databaseSchemasFactory.build(),
      type: 'database/FETCHED_SCHEMA_RESPONSE'
    });
  });

  it('should return type of action updateSchemaResponse and payload', () => {
    expect(updateSchemaResponse(true)).toEqual({
      payload: true,
      type: 'database/UPDATE_SCHEMA_RESPONSE'
    });
  });

  it('should return type of action deleteSchemaResponse and payload', () => {
    expect(
      deleteSchemaResponse(deleteDatabaseSchemasResponseFactory.build())
    ).toEqual({
      payload: deleteDatabaseSchemasResponseFactory.build(),
      type: 'database/DELETE_SCHEMA_RESPONSE'
    });
  });

  it('should return type of action deleteSchemasResponse and payload', () => {
    expect(
      deleteSchemasResponse(deleteDatabaseSchemasResponseFactory.build())
    ).toEqual({
      payload: deleteDatabaseSchemasResponseFactory.build(),
      type: 'database/DELETE_SCHEMAS_RESPONSE'
    });
  });

  it('should return type of action testJdbcConnectionForIdResponse and payload', () => {
    expect(testJdbcConnectionForIdResponse(true)).toEqual({
      payload: true,
      type: 'database/TEST_JDBC_CONNECTION_FOR_ID_RESPONSE'
    });
  });

  it('should return type of action testJdbcConnectionForJdbcUserResponse and payload', () => {
    expect(testJdbcConnectionForJdbcUserResponse(true)).toEqual({
      payload: true,
      type: 'database/TEST_JDBC_CONNECTION_FOR_JDBCUSER_RESPONSE'
    });
  });

  it('should return type of action createDatabaseSchemaResponse and payload', () => {
    expect(
      createDatabaseSchemaResponse(createDatabaseSchemaResponseFactory.build())
    ).toEqual({
      payload: createDatabaseSchemaResponseFactory.build(),
      type: 'database/CREATE_DATABASE_SCHEMA_RESPONSE'
    });
  });
});

describe('database schema reducer', () => {
  it('given defaultState and action fetchSchemaRequest(true) should change isFetchingSchemas to true', () => {
    expect(
      databaseReducer(schemasFactory.build(), fetchSchemaRequest(true))
    ).toEqual(
      schemasFactory.build({
        isFetchingSchemas: true
      })
    );
  });

  it('given defaultState and action createDatabaseSchemaResponse with given values should change createDatabaseSchemaResponse to given values', () => {
    expect(
      databaseReducer(
        schemasFactory.build(),
        createDatabaseSchemaResponse(
          createDatabaseSchemaResponseFactory.build()
        )
      )
    ).toEqual(
      schemasFactory.build({
        createDatabaseSchemaResponse: createDatabaseSchemaResponseFactory.build()
      })
    );
  });

  it('given defaultState and action deleteSchemasResponse with given values should change deleteSchemasResponse to given values', () => {
    expect(
      databaseReducer(
        schemasFactory.build(),
        deleteSchemasResponse(deleteDatabaseSchemasResponseFactory.build())
      )
    ).toEqual(
      schemasFactory.build({
        deleteSchemasResponse: deleteDatabaseSchemasResponseFactory.build()
      })
    );
  });

  it('given defaultState and action deleteSchemasResponse with given values should change deleteSchemasResponse to given values', () => {
    expect(
      databaseReducer(
        schemasFactory.build(),
        deleteSchemaResponse(deleteDatabaseSchemasResponseFactory.build())
      )
    ).toEqual(
      schemasFactory.build({
        deleteSchemasResponse: deleteDatabaseSchemasResponseFactory.build()
      })
    );
  });

  it('given defaultState and action updateSchemaResponse(true) should change updateSchemaResponse to true', () => {
    expect(
      databaseReducer(schemasFactory.build(), updateSchemaResponse(true))
    ).toEqual(schemasFactory.build({ updateSchemaResponse: true }));
  });

  it('given defaultState and action testJdbcConnectionForIdResponse(true) should change testJdbcConnectionResponse to true', () => {
    expect(
      databaseReducer(
        schemasFactory.build(),
        testJdbcConnectionForIdResponse(true)
      )
    ).toEqual(schemasFactory.build({ testJdbcConnectionResponse: true }));
  });

  it('given defaultState and action testJdbcConnectionForJdbcUserResponse(true) should change testJdbcConnectionResponse to true', () => {
    expect(
      databaseReducer(
        schemasFactory.build(),
        testJdbcConnectionForJdbcUserResponse(true)
      )
    ).toEqual(schemasFactory.build({ testJdbcConnectionResponse: true }));
  });
});
