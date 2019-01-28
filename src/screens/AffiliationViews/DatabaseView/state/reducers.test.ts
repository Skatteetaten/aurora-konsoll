import { IDatabaseSchema, IDatabaseSchemas } from 'models/schemas';
import {
  FETCHED_SCHEMA_REQUEST,
  FETCHED_SCHEMA_SUCCESS,
  UPDATE_SCHEMA_REQUEST,
  UPDATE_SCHEMA_SUCCESS
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
        type: FETCHED_SCHEMA_SUCCESS,
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
  it('should return isUpdating as true and updateSchemaResponse as false', () => {
    expect(
      reducer(undefined, {
        type: UPDATE_SCHEMA_REQUEST,
        payload: { isUpdatingSchema: true }
      })
    ).toMatchObject({
      isUpdatingSchema: true,
      updateSchemaResponse: false
    });
  });
  it('should return isUpdating as false and updateSchemaResponse as true', () => {
    expect(
      reducer(undefined, {
        type: UPDATE_SCHEMA_SUCCESS,
        payload: { updateSchemaResponse: true }
      })
    ).toMatchObject({
      isUpdatingSchema: false,
      updateSchemaResponse: true
    });
  });
});
