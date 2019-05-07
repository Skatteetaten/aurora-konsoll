import { StateType } from 'typesafe-actions';
import { DatabaseSchemasAction } from 'screens/AffiliationViews/DatabaseView/state/reducers';
import { StartupAction } from 'state/reducers';
import rootReducer from './rootReducer';
import { WebsealAction } from 'screens/AffiliationViews/WebsealView/state/reducers';
import { CertificateAction } from 'screens/CertificateView/state/reducers';
import { ErrorBoundaryAction } from 'components/ErrorBoundary/state/reducers';
import { ErrorStateManagerAction } from 'models/StateManager/state/reducer';
import { AffiliationViewsAction } from 'screens/AffiliationViews/state/reducer';

export type RootState = StateType<typeof rootReducer>;
export type RootAction =
  | DatabaseSchemasAction
  | StartupAction
  | CertificateAction
  | WebsealAction
  | ErrorBoundaryAction
  | ErrorStateManagerAction
  | AffiliationViewsAction;
