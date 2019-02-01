import { IDatabaseSchema, IDatabaseSchemas } from 'models/schemas';
import {
  DELETE_SCHEMA_RESPONSE,
  FETCHED_SCHEMA_REQUEST,
  FETCHED_SCHEMA_RESPONSE,
  UPDATE_SCHEMA_RESPONSE
} from './actions';
import { databaseReducer as reducer } from './reducers';

import { databaseSchemaFactory } from 'testData/testDataBuilders';

const emptyItems: IDatabaseSchemas = { databaseSchemas: [] };
const schemaItems: IDatabaseSchema = databaseSchemaFactory.build();
const items: IDatabaseSchemas = { databaseSchemas: [schemaItems] };

describe('database schema reducer', () => {

  it('should return isFetching as false and items as list in response', () => {
    expect(
      reducer(undefined, {
        type: FETCHED_SCHEMA_RESPONSE,
        payload: { databaseSchemas: items }
      })
    ).toMatchObject({
      isFetchingSchemas: false,
      databaseSchemas: items
    });
  });

  it('should return isFetching as true and items as empty list', () => {
    expect(
      reducer(undefined, {
        type: FETCHED_SCHEMA_REQUEST,
        payload: { isFetchingSchemas: true }
      })
    ).toMatchObject({
      isFetchingSchemas: true,
      databaseSchemas: emptyItems
    });
  });

  it('should return update schema as true given response', () => {
    expect(
      reducer(undefined, {
        type: UPDATE_SCHEMA_RESPONSE,
        payload: { response: true }
      })
    ).toMatchObject({
      updateSchemaResponse: true
    });
  });

  it('should return delete schema as true given response', () => {
    expect(
      reducer(undefined, {
        type: DELETE_SCHEMA_RESPONSE,
        payload: { response: true }
      })
    ).toMatchObject({
      deleteSchemaResponse: true
    });
  });
});
