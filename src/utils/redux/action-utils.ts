import { createAction, TsActionCreator } from 'redux-ts-utils';
import { IApiClients } from 'models/AuroraApi';
import { RootState, AsyncAction } from 'store/types';
import { addCurrentErrors } from 'screens/ErrorHandler/state/actions';
import { IDataAndErrors } from 'services/GoboClient';

export type RequestActions<P, F = Error> = [
  TsActionCreator<void>,
  TsActionCreator<P>,
  TsActionCreator<F>
];

export function createAsyncActions<P, F = Error>(
  type: string
): [TsActionCreator<void>, TsActionCreator<P>, TsActionCreator<F>] {
  return [
    createAction<void>(type),
    createAction<P>(`${type}_SUCCESS`),
    createAction<F>(`${type}_FAILURE`)
  ];
}

export function doAsyncActions<P>(
  actions: RequestActions<P>,
  fn: (clients: IApiClients, state: RootState) => Promise<P>
): AsyncAction {
  return async (dispatch, getState, { clients }) => {
    const [request, success, failure] = actions;
    try {
      dispatch(request());
      const result = await fn(clients, getState());
      // TODO: Remove
      if (isGoboResult(result)) {
        dispatch(addCurrentErrors(result));
      }
      dispatch(success(result));
    } catch (e) {
      dispatch(failure(e));
    }
  };
}

function isGoboResult(result: any): result is IDataAndErrors<any> {
  return (result as IDataAndErrors<any>).data !== undefined;
}
