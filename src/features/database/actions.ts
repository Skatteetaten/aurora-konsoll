import { createAsyncAction } from 'typesafe-actions';

import {
  FETCHED_SCHEMA_FAILURE,
  FETCHED_SCHEMA_REQUEST,
  FETCHED_SCHEMA_SUCCESS
} from './constants';

export const fetchSchema = createAsyncAction(
  FETCHED_SCHEMA_REQUEST,
  FETCHED_SCHEMA_SUCCESS,
  FETCHED_SCHEMA_FAILURE
)<void, string[], Error>();
