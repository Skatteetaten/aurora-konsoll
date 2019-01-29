import { ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { action } from 'typesafe-actions';

import { IAuroraApiComponentProps } from 'components/AuroraApi';

import { RootAction, RootState } from 'store/types';

import { IDatabaseSchemaInput, IDatabaseSchemas } from 'models/schemas';

export const FETCHED_SCHEMA_REQUEST = 'database/FETCHED_SCHEMA_REQUEST';
export const FETCHED_SCHEMA_SUCCESS = 'database/FETCHED_SCHEMA_SUCCESS';

export const UPDATE_SCHEMA_REQUEST = 'database/UPDATE_SCHEMA_REQUEST';
export const UPDATE_SCHEMA_SUCCESS = 'database/UPDATE_SCHEMA_SUCCESS';

export const fetchSchemaRequest = (isFetchingSchemas: boolean) =>
  action(FETCHED_SCHEMA_REQUEST, { isFetchingSchemas });
export const fetchSchemaSuccess = (databaseSchemas: IDatabaseSchemas) =>
  action(FETCHED_SCHEMA_SUCCESS, { databaseSchemas });

export const updateSchemaRequest = (isUpdatingSchema: boolean) =>
  action(UPDATE_SCHEMA_REQUEST, { isUpdatingSchema });
export const updateSchemaSuccess = (updateSchemaResponse: boolean) =>
  action(UPDATE_SCHEMA_SUCCESS, { updateSchemaResponse });

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
  dispatch(fetchSchemaSuccess(result));
};

export const updateSchema: Thunk = (
  databaseSchema: IDatabaseSchemaInput
) => async (dispatch, getState, { clients }) => {
  dispatch(updateSchemaRequest(true));
  const result = await clients.databaseClient.updateSchema(databaseSchema);
  dispatch(updateSchemaRequest(false));
  dispatch(updateSchemaSuccess(result));
  dispatch(fetchSchemas(databaseSchema.affiliation));
};

export default {
  fetchSchemaRequest,
  fetchSchemaSuccess,
  updateSchemaRequest,
  updateSchemaSuccess
};
