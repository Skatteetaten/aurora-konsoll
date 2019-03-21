import each from 'jest-each';
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
  each([
    [
      { name: 'createDatabaseSchemaResponse', item: schemasFactory.build() },
      {
        name: 'createDatabaseSchemaResponse',
        item: createDatabaseSchemaResponse(
          createDatabaseSchemaResponseFactory.build()
        )
      },
      schemasFactory.build({
        createDatabaseSchemaResponse: createDatabaseSchemaResponseFactory.build()
      })
    ],
    [
      { name: 'fetchSchemaRequest', item: schemasFactory.build() },
      {
        name: 'isFetchingSchemas',
        item: fetchSchemaRequest(true)
      },
      schemasFactory.build({
        isFetchingSchemas: true
      })
    ],
    [
      { name: 'deleteSchemasResponse', item: schemasFactory.build() },
      {
        name: 'deleteSchemasResponse',
        item: deleteSchemasResponse(
          deleteDatabaseSchemasResponseFactory.build()
        )
      },
      schemasFactory.build({
        deleteSchemasResponse: deleteDatabaseSchemasResponseFactory.build()
      })
    ],
    [
      { name: 'deleteSchemaResponse', item: schemasFactory.build() },
      {
        name: 'deleteSchemasResponse',
        item: deleteSchemaResponse(deleteDatabaseSchemasResponseFactory.build())
      },
      schemasFactory.build({
        deleteSchemasResponse: deleteDatabaseSchemasResponseFactory.build()
      })
    ],
    [
      { name: 'updateSchemaResponse', item: schemasFactory.build() },
      {
        name: 'updateSchemaResponse',
        item: updateSchemaResponse(true)
      },
      schemasFactory.build({ updateSchemaResponse: true })
    ],
    [
      { name: 'testJdbcConnectionForIdResponse', item: schemasFactory.build() },
      {
        name: 'testJdbcConnectionResponse',
        item: testJdbcConnectionForIdResponse(true)
      },
      schemasFactory.build({ testJdbcConnectionResponse: true })
    ],
    [
      {
        name: 'testJdbcConnectionForJdbcUserResponse',
        item: schemasFactory.build()
      },
      {
        name: 'testJdbcConnectionResponse',
        item: testJdbcConnectionForIdResponse(true)
      },
      schemasFactory.build({ testJdbcConnectionResponse: true })
    ]
  ]).describe.only('', (a, b, expected) => {
    test.only(`given defaultState and action ${
      a.name
    } with given value should change ${b.name} to given value`, () => {
      expect(databaseReducer(a.item, b.item)).toEqual(expected);
    });
  });
});
