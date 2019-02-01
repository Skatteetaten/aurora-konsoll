import { ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { action } from 'typesafe-actions';

import { IAuroraApiComponentProps } from 'components/AuroraApi';

import { RootAction, RootState } from 'store/types';

import {
  IDatabaseSchema,
  IDatabaseSchemaInputWithUserId,
  IDatabaseSchemas
} from 'models/schemas';

export const FETCHED_SCHEMA_REQUEST = 'database/FETCHED_SCHEMA_REQUEST';
export const FETCHED_SCHEMA_RESPONSE = 'database/FETCHED_SCHEMA_RESPONSE';

export const UPDATE_SCHEMA_RESPONSE = 'database/UPDATE_SCHEMA_RESPONSE';

export const DELETE_SCHEMA_RESPONSE = 'database/UPDATE_SCHEMA_RESPONSE';

export const fetchSchemaRequest = (isFetchingSchemas: boolean) =>
  action(FETCHED_SCHEMA_REQUEST, { isFetchingSchemas });
export const fetchSchemaResponse = (databaseSchemas: IDatabaseSchemas) =>
  action(FETCHED_SCHEMA_RESPONSE, { databaseSchemas });

export const updateSchemaResponse = (response: boolean) =>
  action(UPDATE_SCHEMA_RESPONSE, { response });

export const deleteSchemaResponse = (response: boolean) =>
  action(DELETE_SCHEMA_RESPONSE, { response });

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
  dispatch(fetchSchemaResponse(result));
};

export const updateSchema: Thunk = (
  databaseSchema: IDatabaseSchemaInputWithUserId
) => async (dispatch, getState, { clients }) => {
  const result = await clients.databaseClient.updateSchema(databaseSchema);
  dispatch(updateSchemaResponse(result));
  dispatch(fetchSchemas([databaseSchema.affiliation]));
};

export const deleteSchema: Thunk = (
  databaseSchema: IDatabaseSchema
) => async (dispatch, getState, { clients }) => {
  const result = await clients.databaseClient.deleteSchema(databaseSchema.id);
  dispatch(deleteSchemaResponse(result));
  dispatch(fetchSchemas([databaseSchema.affiliation.name]));
}

export default {
  fetchSchemaRequest,
  fetchSchemaResponse,
  updateSchemaResponse
};
