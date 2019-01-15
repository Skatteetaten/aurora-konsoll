import { combineReducers } from 'redux';
import { StateType } from 'typesafe-actions';
import { countersReducer } from '../features/counter';
import { netDebugCall } from '../services/auroraApiClients/databaseClient/reducer';

const rootReducer = combineReducers({
  counters: countersReducer,
  schemas: netDebugCall
});

export type RootState = StateType<typeof rootReducer>;

export default rootReducer;
