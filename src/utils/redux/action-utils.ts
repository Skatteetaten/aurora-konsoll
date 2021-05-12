import { createAction, PayloadActionCreator } from '@reduxjs/toolkit';
import { IApiClients } from 'models/AuroraApi';
import { RootState, AsyncAction } from 'store/types';
import { addCurrentErrors } from 'screens/ErrorHandler/state/actions';
import { IDataAndErrors } from 'services/GoboClient';

export type RequestActions<P, F = Error> = {
  request: PayloadActionCreator<void>;
  success: PayloadActionCreator<P>;
  failure: PayloadActionCreator<F>;
};

export function createAsyncActions<P, F = Error>(
  type: string
): RequestActions<P, F> {
  return {
    request: createAction<void>(type),
    success: createAction<P>(`${type}_SUCCESS`),
    failure: createAction<F>(`${type}_FAILURE`),
  };
}

export function doAsyncActions<P>(
  requestActions: RequestActions<P>,
  fn: (clients: IApiClients, state: RootState) => Promise<P>
): AsyncAction<Promise<void>> {
  return async (dispatch, getState, { clients }) => {
    const { request, success, failure } = requestActions;
    try {
      dispatch(request());
      const result = await fn(clients, getState());
      // TODO: Remove, use errors in reducer.
      if (isDataAndErrors(result)) {
        dispatch(addCurrentErrors(result));
      } else if (isDataAndErrorsMap(result)) {
        Object.values(result).forEach((val) => {
          dispatch(addCurrentErrors(val));
        });
      }
      dispatch(success(result));
    } catch (e) {
      dispatch(failure(e));
    }
  };
}

function isDataAndErrors(result: any): result is IDataAndErrors<any> {
  return (result as IDataAndErrors<any>).name !== undefined;
}

// This is just for fetchVersions
function isDataAndErrorsMap(
  result: any
): result is Record<string, IDataAndErrors<any>> {
  return Object.values(result).reduce<boolean>(
    (result, val) => result && isDataAndErrors(val),
    false
  );
}
