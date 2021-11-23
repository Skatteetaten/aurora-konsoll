import { ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { StateType } from 'typesafe-actions';

import { DatabaseSchemasAction } from 'web/screens/AffiliationViews/DatabaseView/state/reducers';
import { WebsealAction } from 'web/screens/AffiliationViews/WebsealView/state/reducers';
import { CertificateAction } from 'web/screens/CertificateView/state/reducers';
import { ErrorsAction } from 'web/screens/ErrorHandler/state/reducer';
import { NetdebugViewAction } from 'web/screens/NetdebugView/state/reducer';

import { VersionsAction } from './state/versions/actions';

import { rootReducer } from './rootReducer';
import { ResolveThunks } from 'react-redux';
import { IApiClients } from 'web/models//AuroraApi';
import { UserSettingsAction } from './state/userSettings/actions';
import { ApplicationsAction } from './state/applicationDeployments/actions';
import { StartupAction } from './state/startup/actions';
import { DnsAction } from './state/dns/actions';

export type RootState = StateType<typeof rootReducer>;

export type RootAction =
  | ApplicationsAction
  | VersionsAction
  | DatabaseSchemasAction
  | StartupAction
  | CertificateAction
  | WebsealAction
  | ErrorsAction
  | UserSettingsAction
  | NetdebugViewAction
  | DnsAction;

export interface IExtraArguments {
  clients: IApiClients;
}

export type AsyncAction<T = void> = ThunkAction<
  T,
  RootState,
  IExtraArguments,
  RootAction
>;

export type Thunk = ActionCreator<AsyncAction>;

/**
 * Usage ReduxProps<typeof mapDispatchToProps, typeof mapStateToProps>
 *
 * If only mapDispatchToProps is used, use ResolveThunks<typeof mapDispatchToProps>
 * If only mapStateToProps is used, use ReturnType<typeof mapStateToProps>
 */
export type ReduxProps<D, S extends (...args: any) => any> = ResolveThunks<D> &
  ReturnType<S>;
