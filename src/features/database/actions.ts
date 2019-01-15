import { action } from 'typesafe-actions';

import {
  FETCHED_SCHEMA_FAILURE,
  FETCHED_SCHEMA_REQUEST,
  FETCHED_SCHEMA_SUCCESS
} from './constants';

export const fetchSchemaRequest = () =>
  action(FETCHED_SCHEMA_REQUEST, 'loading');
export const fetchSchemaSuccess = (response: any) =>
  action(FETCHED_SCHEMA_SUCCESS, response);
export const fetchSchemaFailure = (errorMessage: string) =>
  action(FETCHED_SCHEMA_FAILURE, errorMessage);
