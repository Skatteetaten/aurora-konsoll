import { errorsReducer } from 'screens/ErrorHandler/state/reducer';
import { combineReducers } from 'redux';
import { databaseReducer } from 'screens/AffiliationViews/DatabaseView/state/reducers';
import { affiliationViewReducer } from 'screens/AffiliationViews/state/reducer';
import { websealReducer } from 'screens/AffiliationViews/WebsealView/state/reducers';
import { certificateReducer } from 'screens/CertificateView/state/reducers';
import { netdebugViewReducer } from 'screens/NetdebugView/state/reducer';
import { startupReducer } from 'state/reducers';

import { versionsReducer } from './state/versions/reducers';
import { deployReducer } from './state/deploy/reducers';

export const rootReducer = combineReducers({
  database: databaseReducer,
  startup: startupReducer,
  webseal: websealReducer,
  certificate: certificateReducer,
  errors: errorsReducer,
  affiliationView: affiliationViewReducer,
  netdebug: netdebugViewReducer,
  versions: versionsReducer,
  deploy: deployReducer
});
