import { combineReducers } from 'redux';
import { ActionType } from 'typesafe-actions';

import * as counters from './actions';
import { ADD, INCREMENT } from './constants';

export type CountersAction = ActionType<typeof counters>;

export interface ICountersState {
  readonly reduxCounter: number;
}

export default combineReducers<ICountersState, CountersAction>({
  reduxCounter: (state = 0, action) => {
    switch (action.type) {
      case INCREMENT:
        return state + 1;

      case ADD:
        return state + action.payload;

      default:
        return state;
    }
  }
});
