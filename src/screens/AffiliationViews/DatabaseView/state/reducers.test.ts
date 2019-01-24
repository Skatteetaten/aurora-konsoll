import { IDatabaseSchema, IDatabaseSchemas } from 'models/schemas';
import { FETCHED_SCHEMA_REQUEST, FETCHED_SCHEMA_SUCCESS } from './actions';
import { databaseReducer as reducer } from './reducers';

import { databaseSchemaFactory } from 'testData/testDataBuilders';

const emptyItems: IDatabaseSchemas = { databaseSchemas: [] };
const schemaItems: IDatabaseSchema = databaseSchemaFactory.build();
const items: IDatabaseSchemas = { databaseSchemas: [schemaItems] };

describe('database schema reducer', () => {
  it('should return isLoading as false and items as list in response', () => {
    expect(
      reducer(undefined, {
        type: FETCHED_SCHEMA_SUCCESS,
        payload: { response: items }
      })
    ).toEqual({
      isLoading: false,
      items
    });
  });
  it('should return isLoading as true and items as empty list', () => {
    expect(
      reducer(undefined, {
        type: FETCHED_SCHEMA_REQUEST,
        payload: { isLoading: true }
      })
    ).toEqual({
      isLoading: true,
      items: emptyItems
    });
  });
});
