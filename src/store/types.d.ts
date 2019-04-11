import { StateType } from 'typesafe-actions';
import { DatabaseSchemasAction } from 'screens/AffiliationViews/DatabaseView/state/reducers';
import { StartupAction } from 'state/reducers';
import rootReducer from './rootReducer';
import { CertificateAction } from 'screens/CertificateView/state/reducers';

export type RootState = StateType<typeof rootReducer>;
export type RootAction =
  | DatabaseSchemasAction
  | StartupAction
  | CertificateAction;
