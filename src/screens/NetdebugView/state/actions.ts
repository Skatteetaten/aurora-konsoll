import { ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { IAuroraApiComponentProps } from 'components/AuroraApi';

import { addCurrentErrors } from 'screens/ErrorHandler/state/actions';
import { createAction } from 'redux-ts-utils';
import { INetdebugResult, IScanStatus } from 'services/auroraApiClients';
import {
  IScanQuery,
  IScanStatusQuery
} from 'services/auroraApiClients/netdebugClient/query';
import { RootAction, RootState } from 'store/types';

const netdebugViewAction = (action: string) => `netdebugView/${action}`;

export const fetchNetdebugStatusResponse = createAction<INetdebugResult>(
  netdebugViewAction('FETCH_NETDEBUG_RESPONSE')
);

export const fetchNetdebugStatusRequest = createAction<boolean>(
  netdebugViewAction('FETCH_NETDEBUG_REQUEST')
);

export type Thunk = ActionCreator<
  ThunkAction<void, RootState, IAuroraApiComponentProps, RootAction>
>;

const errorMessage = {
  failed: [],
  open: [],
  status: 'Noe gikk galt'
};

export const findNetdebugStatus: Thunk = (host: string, port: string) => async (
  dispatch,
  getState,
  { clients }
) => {
  dispatch(fetchNetdebugStatusRequest(true));
  const result = await clients.netdebugClient.findNetdebugStatus(host, port);
  dispatch(addCurrentErrors(result));
  if (!result) {
    dispatch(fetchNetdebugStatusResponse(errorMessage));
  } else {
    dispatch(fetchNetdebugStatusResponse(showNetdebugStatus(result.data)));
  }
  dispatch(fetchNetdebugStatusRequest(false));
};

const normalizeScanStatus = (scanStatus?: IScanStatusQuery): IScanStatus[] => {
  if (!scanStatus) {
    return [];
  }

  return scanStatus.edges.map(edge => {
    const { clusterNode, message, status, resolvedIp } = edge.node;
    return {
      clusterNodeIp: clusterNode && clusterNode.ip,
      message,
      resolvedIp,
      status
    };
  });
};

const showNetdebugStatus = (item: IScanQuery): INetdebugResult => {
  if (item && item.scan) {
    return {
      failed: normalizeScanStatus(item.scan.failed),
      open: normalizeScanStatus(item.scan.open),
      status: item.scan.status
    };
  } else {
    return errorMessage;
  }
};

export default {
  fetchNetdebugStatusRequest,
  fetchNetdebugStatusResponse
};
