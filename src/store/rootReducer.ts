import { combineReducers } from 'redux';
import { databaseReducer } from 'screens/AffiliationViews/DatabaseView/state/reducers';
import { certificateReducer } from 'screens/CertificateView/state/reducers';
import { startupReducer } from 'state/reducers';

const rootReducer = combineReducers({
  database: databaseReducer,
  startup: startupReducer,
  certificate: certificateReducer
});

export default rootReducer;
