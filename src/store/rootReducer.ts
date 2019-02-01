import { combineReducers } from 'redux';
import { databaseReducer } from 'screens/AffiliationViews/DatabaseView/state/reducers';

const rootReducer = combineReducers({
  database: databaseReducer
});

export default rootReducer;
