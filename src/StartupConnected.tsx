import { connect } from 'react-redux';

import Startup from 'Startup';
import { RootState } from 'store/types';
import { getCurrentUser } from './state/actions';
import { IStartupState } from './state/reducers';

const fetchCurrentUser = (state: IStartupState) => state.currentUser;

const mapStateToProps = (state: RootState) => ({
  currentUser: fetchCurrentUser(state.startup)
});

export const StartupConnected = connect(
  mapStateToProps,
  {
    onFetchCurrentUser: () => getCurrentUser()
  }
)(Startup);
