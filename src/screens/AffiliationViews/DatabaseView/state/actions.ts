import { ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { action } from 'typesafe-actions';

import { IAuroraApiComponentProps } from 'components/AuroraApi';

import { RootAction, RootState } from 'store/types';

import { IDatabaseSchemas } from 'models/schemas';

export const FETCHED_SCHEMA_REQUEST = 'database/FETCHED_SCHEMA_REQUEST';
export const FETCHED_SCHEMA_SUCCESS = 'database/FETCHED_SCHEMA_SUCCESS';

export const fetchSchemaRequest = (isLoading: boolean) =>
  action(FETCHED_SCHEMA_REQUEST, { isLoading });
export const fetchSchemaSuccess = (response: IDatabaseSchemas) =>
  action(FETCHED_SCHEMA_SUCCESS, { response });

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

export default { fetchSchemaRequest, fetchSchemaSuccess };
