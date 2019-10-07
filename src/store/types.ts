import { ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { StateType } from 'typesafe-actions';

import { IAuroraApiComponentProps } from 'components/AuroraApi';

import { DatabaseSchemasAction } from 'screens/AffiliationViews/DatabaseView/state/reducers';
import { WebsealAction } from 'screens/AffiliationViews/WebsealView/state/reducers';
import { CertificateAction } from 'screens/CertificateView/state/reducers';
import { ErrorsAction } from 'screens/ErrorHandler/state/reducer';
import { AffiliationViewAction } from 'screens/AffiliationViews/state/reducer';
import { NetdebugViewAction } from 'screens/NetdebugView/state/reducer';
import { StartupAction } from 'state/reducers';

import { VersionsAction } from './state/versions/actions';
import { DeployAction } from './state/deploy/actions';

import { rootReducer } from './rootReducer';
import { ResolveThunks } from 'react-redux';

export type RootState = StateType<typeof rootReducer>;

export type RootAction =
  | VersionsAction
  | DeployAction
  | DatabaseSchemasAction
  | StartupAction
  | CertificateAction
  | WebsealAction
  | ErrorsAction
  | AffiliationViewAction
  | NetdebugViewAction;

export type StateThunk = ThunkAction<
  void,
  RootState,
  IAuroraApiComponentProps,
  RootAction
>;

export type Thunk = ActionCreator<StateThunk>;

/**
 * Usage ReduxProps<typeof mapDispatchToProps, typeof mapStateToProps>
 */
export type ReduxProps<D, S extends (...args: any) => any> = ResolveThunks<D> &
  ReturnType<S>;
