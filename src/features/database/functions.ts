import { RootAction, RootState } from 'store/types';

import { IAuroraApiComponentProps } from 'components/AuroraApi';
import { ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';

import {
  fetchSchemaFailure,
  fetchSchemaRequest,
  fetchSchemaSuccess
} from './actions';

export type Thunk = ActionCreator<
  ThunkAction<void, RootState, IAuroraApiComponentProps, RootAction>
>;

export const fetchSchemas: Thunk = (host: string, port: string) => async (
  dispatch,
  getState,
  { clients }
) => {
  dispatch(fetchSchemaRequest());
  try {
    const result = await clients.netdebugClient.findNetdebugStatus(host, port);
    dispatch(fetchSchemaSuccess(result));
  } catch (err) {
    dispatch(fetchSchemaFailure(err));
  }
};
