import { combineReducers } from 'redux';
import { databaseReducer } from 'screens/DatabaseView/state/reducers';

const rootReducer = combineReducers({
  database: databaseReducer
});

export default rootReducer;
