import { combineReducers } from 'redux';
import { databaseReducer } from 'screens/AffiliationViews/DatabaseView/state/reducers';
import { startupReducer } from 'state/reducers';

const rootReducer = combineReducers({
  database: databaseReducer,
  startup: startupReducer
});

export default rootReducer;
