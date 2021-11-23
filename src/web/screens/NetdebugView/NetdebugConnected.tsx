import { connect } from 'react-redux';

import { RootState } from 'web/store/types';
import { Netdebug } from './Netdebug';
import { findNetdebugStatus } from './state/actions';
import { INetdebugViewState } from './state/reducer';

const getFetchingStatus = (state: INetdebugViewState) => state.isFetching;

const getItems = (state: INetdebugViewState) => state.netdebugStatus;

const mapStateToProps = (state: RootState) => ({
  isFetching: getFetchingStatus(state.netdebug),
  netdebugStatus: getItems(state.netdebug),
});

export const NetdebugConnected = connect(mapStateToProps, {
  findNetdebugStatus: (host: string, port: string) =>
    findNetdebugStatus(host, port),
})(Netdebug);
