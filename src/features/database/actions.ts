import { action } from 'typesafe-actions';

import { INetdebugResult } from 'services/auroraApiClients';

import {
  FETCHED_SCHEMA_FAILURE,
  FETCHED_SCHEMA_REQUEST,
  FETCHED_SCHEMA_SUCCESS
} from './constants';

export const fetchSchemaRequest = (isLoading: boolean) =>
  action(FETCHED_SCHEMA_REQUEST, { isLoading });
export const fetchSchemaSuccess = (response?: INetdebugResult | null) =>
  action(FETCHED_SCHEMA_SUCCESS, { response });
export const fetchSchemaFailure = (errorMessage: boolean) =>
  action(FETCHED_SCHEMA_FAILURE, { errorMessage });
