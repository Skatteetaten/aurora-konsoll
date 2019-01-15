import { combineReducers } from 'redux';
import { ActionType } from 'typesafe-actions';
import * as actions from './actions';

import { SchemasAction } from './models';

import {
  FETCHED_SCHEMA_FAILURE,
  FETCHED_SCHEMA_REQUEST,
  FETCHED_SCHEMA_SUCCESS
} from './constants';

export type SchemaAction = ActionType<typeof actions>;

export interface IDatabaseState {
  readonly schema: any;
}

export default combineReducers<IDatabaseState, SchemasAction>({
  schema: (state = '', action) => {
    switch (action.type) {
      case FETCHED_SCHEMA_REQUEST:
        return action.payload;
      case FETCHED_SCHEMA_SUCCESS:
        return action.payload;
      case FETCHED_SCHEMA_FAILURE:
        return action.payload;
      default:
        return state;
    }
  }
});
