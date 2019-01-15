import { ActionType } from 'typesafe-actions';
import * as actions from './actions';

import { RootAction } from '../../../store/types';

import GoboClient from 'services/GoboClient';

import { ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { FETCHED_SCHEMA_SUCCESS } from './constants';

import { NETDEBUG_QUERY } from '../netdebugClient/query';

export type SchemaAction = ActionType<typeof actions>;

export interface IRootState {
  readonly schema: IUserState;
}

export type Thunk = ActionCreator<
  ThunkAction<void, IRootState, GoboClient, RootAction>
>;

export type RootAction = SchemaAction;

export interface IUserState {
  readonly groups: string[];
  readonly isLoading: boolean;
}

export const scanResults = (user: any): SchemaAction => ({
  type: FETCHED_SCHEMA_SUCCESS,
  payload: user
});

export const netDebugCall: Thunk = (host: string, port: string) => async (
  dispatch,
  getState,
  client
) => {
  try {
    // tslint:disable-next-line:no-console
    console.log('fungerer');
    // tslint:disable-next-line:no-console
    console.log(host, port);

    const result = await client.query<any>({
      query: NETDEBUG_QUERY,
      variables: {
        host,
        port
      }
    });
    dispatch(scanResults(result));
  } catch (err) {
    throw err;
  }
};
