import { combineReducers } from 'redux';
import { countersReducer } from '../features/counter';
import { schemasReducer } from '../features/database';

const rootReducer = combineReducers({
  counters: countersReducer,
  databaseSchemas: schemasReducer
});

export default rootReducer;
