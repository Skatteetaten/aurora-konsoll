import { combineReducers } from 'redux';
import { databaseReducer } from 'screens/AffiliationViews/DatabaseView/state/reducers';
import { websealReducer } from 'screens/AffiliationViews/WebsealView/state/reducers';
import { startupReducer } from 'state/reducers';

const rootReducer = combineReducers({
  database: databaseReducer,
  startup: startupReducer,
  webseal: websealReducer
});

export default rootReducer;
