import { errorsReducer } from 'web/screens/ErrorHandler/state/reducer';
import { combineReducers } from 'redux';
import { databaseReducer } from 'web/screens/AffiliationViews/DatabaseView/state/reducers';
import { websealReducer } from 'web/screens/AffiliationViews/WebsealView/state/reducers';
import { certificateReducer } from 'web/screens/CertificateView/state/reducers';
import { netdebugViewReducer } from 'web/screens/NetdebugView/state/reducer';
import { startupReducer } from 'web/store/state/startup/reducers';

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
