import { handleAction, reduceReducers } from 'redux-ts-utils';
import { ActionType } from 'typesafe-actions';
import { IErrorState } from '../ErrorStateManager';
import actions, { allErrorsAction } from './actions';

export type ErrorStateManagerAction = ActionType<typeof actions>;

export interface IErrorStateManagerState {
  readonly errors: IErrorState;
}

function updateStateWithPayload(name: string) {
  return (
    state: IErrorStateManagerState,
    { payload }: ErrorStateManagerAction
  ) => {
    state[name] = payload;
  };
}

const initialState: IErrorStateManagerState = {
  errors: {
    allErrors: new Map(),
    errorQueue: [{ id: 0, error: Error(), isActive: false }]
  }
};

export const errorStateManagerReducer = reduceReducers<IErrorStateManagerState>(
  [handleAction(allErrorsAction, updateStateWithPayload('errors'))],
  initialState
);
