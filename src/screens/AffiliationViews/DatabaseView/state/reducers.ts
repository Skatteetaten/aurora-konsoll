import { ActionType } from 'typesafe-actions';
import actions, {
  createDatabaseSchemaResponse,
  deleteSchemaResponse,
  deleteSchemasResponse,
  fetchSchemaRequest,
  fetchSchemaResponse,
  testJdbcConnectionForIdResponse,
  testJdbcConnectionForJdbcUserResponse,
  updateSchemaResponse
} from './actions';

import {
  ICreateDatabaseSchemaResponse,
  IDatabaseSchemas,
  IDeleteDatabaseSchemasResponse
} from 'models/schemas';
import { handleAction, reduceReducers } from 'redux-ts-utils';

export type DatabaseSchemasAction = ActionType<typeof actions>;

export interface ISchemasState {
  readonly isFetchingSchemas: boolean;
  readonly databaseSchemas: IDatabaseSchemas;
  readonly updateSchemaResponse: boolean;
  readonly deleteSchemasResponse: IDeleteDatabaseSchemasResponse;
  readonly testJdbcConnectionResponse: boolean;
  readonly createDatabaseSchemaResponse: ICreateDatabaseSchemaResponse;
}

const initialState = (): ISchemasState => {
  return {
    isFetchingSchemas: false,
    databaseSchemas: { databaseSchemas: [] },
    updateSchemaResponse: false,
    deleteSchemasResponse: { failed: [], succeeded: [] },
    testJdbcConnectionResponse: false,
    createDatabaseSchemaResponse: {
      id: '',
      jdbcUser: { jdbcUrl: '', username: '', password: '' }
    }
  };
};

// function updateStateWithPayload(name: string) {
//   return (state, { payload }) => {
//     state[name] = payload;
//   }
// }

export const databaseReducer = reduceReducers<ISchemasState>(
  [
    handleAction(fetchSchemaRequest, (state, { payload }) => {
      state.isFetchingSchemas = payload;
    }),
    handleAction(fetchSchemaResponse, (state, { payload }) => {
      state.databaseSchemas = payload;
    }),
    handleAction(updateSchemaResponse, (state, { payload }) => {
      state.updateSchemaResponse = payload;
    }),
    handleAction(
      deleteSchemaResponse,
      (state, { payload }) => (state.deleteSchemasResponse = payload)
    ),
    handleAction(deleteSchemasResponse, (state, { payload }) => {
      state.deleteSchemasResponse = payload;
    }),
    handleAction(testJdbcConnectionForIdResponse, (state, { payload }) => {
      state.testJdbcConnectionResponse = payload;
    }),
    handleAction(
      testJdbcConnectionForJdbcUserResponse,
      (state, { payload }) => {
        state.testJdbcConnectionResponse = payload;
      }
    ),
    handleAction(createDatabaseSchemaResponse, (state, { payload }) => {
      state.createDatabaseSchemaResponse = payload;
    })
  ],
  initialState()
);
