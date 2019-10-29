import { ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { StateType } from 'typesafe-actions';

import { DatabaseSchemasAction } from 'screens/AffiliationViews/DatabaseView/state/reducers';
import { WebsealAction } from 'screens/AffiliationViews/WebsealView/state/reducers';
import { CertificateAction } from 'screens/CertificateView/state/reducers';
import { ErrorsAction } from 'screens/ErrorHandler/state/reducer';
import { AffiliationViewAction } from 'screens/AffiliationViews/state/reducer';
import { NetdebugViewAction } from 'screens/NetdebugView/state/reducer';

import { VersionsAction } from './state/versions/actions';
import { DeployAction } from './state/deploy/actions';

import { rootReducer } from './rootReducer';
import { ResolveThunks } from 'react-redux';
import { IApiClients } from 'models/AuroraApi';
import { UserSettingsAction } from './state/userSettings/actions';
import { ApplicationsAction } from './state/applicationDeployments/actions';
import { StartupAction } from './state/startup/actions';

export type RootState = StateType<typeof rootReducer>;

export type RootAction =
  | ApplicationsAction
  | VersionsAction
  | DeployAction
  | DatabaseSchemasAction
  | StartupAction
  | CertificateAction
  | WebsealAction
  | ErrorsAction
  | AffiliationViewAction
  | UserSettingsAction
  | NetdebugViewAction;

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
