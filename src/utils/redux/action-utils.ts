import { createAction, TsActionCreator } from 'redux-ts-utils';
import { IApiClients } from 'models/AuroraApi';
import { RootState, AsyncAction } from 'store/types';
import { addCurrentErrors } from 'screens/ErrorHandler/state/actions';
import { IDataAndErrors } from 'services/GoboClient';

export type RequestActions<P, F = Error> = {
  request: TsActionCreator<void>;
  success: TsActionCreator<P>;
  failure: TsActionCreator<F>;
};

export function createAsyncActions<P, F = Error>(
  type: string
): RequestActions<P, F> {
  return {
    request: createAction<void>(type),
    success: createAction<P>(`${type}_SUCCESS`),
    failure: createAction<F>(`${type}_FAILURE`)
  };
}

export function doAsyncActions<P>(
  requestActions: RequestActions<P>,
  fn: (clients: IApiClients, state: RootState) => Promise<P>
): AsyncAction {
  return async (dispatch, getState, { clients }) => {
    const { request, success, failure } = requestActions;
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
  return (result as IDataAndErrors<any>).name !== undefined;
}
