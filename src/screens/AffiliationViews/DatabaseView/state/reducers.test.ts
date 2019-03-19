// import { IDatabaseSchema, IDatabaseSchemas } from 'models/schemas';
// import {
//   CREATE_DATABASE_SCHEMA_RESPONSE,
//   DELETE_SCHEMAS_RESPONSE,
//   FETCHED_SCHEMA_REQUEST,
//   FETCHED_SCHEMA_RESPONSE,
//   TEST_JDBC_CONNECTION_FOR_ID_RESPONSE,
//   TEST_JDBC_CONNECTION_FOR_JDBCUSER_RESPONSE,
//   UPDATE_SCHEMA_RESPONSE
// } from './actions';
// import { databaseReducer as reducer } from './reducers';

// import {
//   createDatabaseSchemaResponse,
//   databaseSchemaFactory
// } from 'testData/testDataBuilders';

// const emptyItems: IDatabaseSchemas = { databaseSchemas: [] };
// const schemaItems: IDatabaseSchema = databaseSchemaFactory.build();
// const items: IDatabaseSchemas = { databaseSchemas: [schemaItems] };

// describe('database schema reducer', () => {
//   it('should return isFetching as false and items as list in response', () => {
//     expect(
//       reducer(undefined, {
//         type: FETCHED_SCHEMA_RESPONSE,
//         payload: { databaseSchemas: items }
//       })
//     ).toMatchObject({
//       isFetchingSchemas: false,
//       databaseSchemas: items
//     });
//   });

//   it('should return isFetching as true and items as empty list', () => {
//     expect(
//       reducer(undefined, {
//         type: FETCHED_SCHEMA_REQUEST,
//         payload: { isFetchingSchemas: true }
//       })
//     ).toMatchObject({
//       isFetchingSchemas: true,
//       databaseSchemas: emptyItems
//     });
//   });

//   it('should return update schema as true given response', () => {
//     expect(
//       reducer(undefined, {
//         type: UPDATE_SCHEMA_RESPONSE,
//         payload: { response: true }
//       })
//     ).toMatchObject({
//       updateSchemaResponse: true
//     });
//   });

//   it('should return delete schema as true given response', () => {
//     expect(
//       reducer(undefined, {
//         type: DELETE_SCHEMAS_RESPONSE,
//         payload: { response: { succeeded: ['123'], failed: ['234'] } }
//       })
//     ).toMatchObject({
//       deleteSchemasResponse: { succeeded: ['123'], failed: ['234'] }
//     });
//   });

//   it('should return jdbc connection result for id as true given response', () => {
//     expect(
//       reducer(undefined, {
//         type: TEST_JDBC_CONNECTION_FOR_ID_RESPONSE,
//         payload: { response: true }
//       })
//     ).toMatchObject({
//       testJdbcConnectionResponse: true
//     });
//   });

//   it('should return jdbc connection result for jdbc user as true given response', () => {
//     expect(
//       reducer(undefined, {
//         type: TEST_JDBC_CONNECTION_FOR_JDBCUSER_RESPONSE,
//         payload: { response: true }
//       })
//     ).toMatchObject({
//       testJdbcConnectionResponse: true
//     });
//   });

//   it('should return create database schema result as true given response', () => {
//     expect(
//       reducer(undefined, {
//         type: CREATE_DATABASE_SCHEMA_RESPONSE,
//         payload: { response: createDatabaseSchemaResponse.build() }
//       })
//     ).toMatchObject({
//       createDatabaseSchemaResponse: createDatabaseSchemaResponse.build()
//     });
//   });
// });
