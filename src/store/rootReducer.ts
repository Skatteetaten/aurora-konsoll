import { errorsReducer } from 'screens/ErrorHandler/state/reducer';
import { combineReducers } from 'redux';
import { databaseReducer } from 'screens/AffiliationViews/DatabaseView/state/reducers';
import { websealReducer } from 'screens/AffiliationViews/WebsealView/state/reducers';
import { certificateReducer } from 'screens/CertificateView/state/reducers';
import { netdebugViewReducer } from 'screens/NetdebugView/state/reducer';
import { startupReducer } from 'store/state/startup/reducers';

import { versionsReducer } from './state/versions/reducers';
import { userSettingsReducer } from './state/userSettings/reducers';
import { applicationsReducer } from './state/applicationDeployments/reducer';
import { dnsReducer } from './state/dns/reducer';

export const rootReducer = combineReducers({
  database: databaseReducer,
  startup: startupReducer,
  webseal: websealReducer,
  certificate: certificateReducer,
  errors: errorsReducer,
  netdebug: netdebugViewReducer,
  versions: versionsReducer,
  userSettings: userSettingsReducer,
  applications: applicationsReducer,
  dns: dnsReducer,
});
