import { DatabaseSchemasAction } from 'screens/AffiliationViews/DatabaseView/state/reducers';
import { WebsealAction } from 'screens/AffiliationViews/WebsealView/state/reducers';
import { CertificateAction } from 'screens/CertificateView/state/reducers';
import { ErrorsAction } from 'screens/ErrorHandler/state/reducer';
import { AffiliationViewAction } from 'screens/AffiliationViews/state/reducer';
import { NetdebugViewAction } from 'screens/NetdebugView/state/reducer';

import { StartupAction } from 'state/reducers';

import { ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { IAuroraApiComponentProps } from 'components/AuroraApi';
import { RootAction } from './types';
import { StateType } from 'typesafe-actions';
import { rootReducer } from 'store';

export type RootState = StateType<typeof rootReducer>;

export type RootAction =
  | DatabaseSchemasAction
  | StartupAction
  | CertificateAction
  | WebsealAction
  | ErrorsAction
  | AffiliationViewAction
  | NetdebugViewAction;

export type Thunk = ActionCreator<
  ThunkAction<void, RootState, IAuroraApiComponentProps, RootAction>
>;
