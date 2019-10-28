import { createAction, TsActionCreator } from 'redux-ts-utils';
import { IApiClients } from 'models/AuroraApi';
import {
  RootState,
  AsyncAction,
  IExtraArguments,
  RootAction
} from 'store/types';
import { addCurrentErrors } from 'screens/ErrorHandler/state/actions';
import { IGoboResult } from 'services/GoboClient';
import { ThunkDispatch } from 'redux-thunk';

type Dispatch = ThunkDispatch<RootState, IExtraArguments, RootAction>;

export type RequestActions<P, F = Error> = [
  TsActionCreator<void>,
  TsActionCreator<P>,
  TsActionCreator<F[]>
];

export function createAsyncActions<R, S, F = Error>(
  type: string
): [TsActionCreator<R>, TsActionCreator<S>, TsActionCreator<F[]>] {
  return [
    createAction<R>(type),
    createAction<S>(`${type}_SUCCESS`),
    createAction<F[]>(`${type}_FAILURE`)
  ];
}

export function doAsyncActions<P>(
  actions: RequestActions<P>,
  fn: (
    clients: IApiClients,
    state: () => RootState,
    dispatch: Dispatch
  ) => Promise<P>
): AsyncAction<P> {
  return async (dispatch, getState, { clients }) => {
    const [request, success, failure] = actions;
    try {
      dispatch(request());
      const result = await fn(clients, getState, dispatch);
      // TODO: Remove?
      if (isGoboResult(result)) {
        dispatch(addCurrentErrors(result));
      }
      return dispatch(success(result));
    } catch (e) {
      dispatch(failure([e]));
    }
  };
}

function isGoboResult(result: any): result is IGoboResult<any> {
  return (result as IGoboResult<any>).data !== undefined;
}
