import { errorBoundaryReducer } from 'components/ErrorBoundary/state/reducers';
import { errorStateManagerReducer } from 'models/StateManager/state/reducer';
import { combineReducers } from 'redux';
import { databaseReducer } from 'screens/AffiliationViews/DatabaseView/state/reducers';
import { affiliationViewsReducer } from 'screens/AffiliationViews/state/reducer';
import { websealReducer } from 'screens/AffiliationViews/WebsealView/state/reducers';
import { certificateReducer } from 'screens/CertificateView/state/reducers';
import { startupReducer } from 'state/reducers';

const rootReducer = combineReducers({
  database: databaseReducer,
  startup: startupReducer,
  webseal: websealReducer,
  certificate: certificateReducer,
  errorBoundary: errorBoundaryReducer,
  errorStateManager: errorStateManagerReducer,
  affiliationViews: affiliationViewsReducer
});

export default rootReducer;
