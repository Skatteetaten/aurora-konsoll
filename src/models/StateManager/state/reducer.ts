import { handleAction, reduceReducers } from 'redux-ts-utils';
import { ActionType } from 'typesafe-actions';
import { IErrorState } from '../ErrorStateManager';
import actions, { allErrorsAction, incrementId } from './actions';

export type ErrorStateManagerAction = ActionType<typeof actions>;

export interface IErrorStateManagerState {
  readonly errors: IErrorState;
  readonly errorCount: number;
}

function updateStateWithPayload(name: string) {
  return (
    state: IErrorStateManagerState,
    { payload }: ErrorStateManagerAction
  ) => {
    state[name] = payload;
  };
}

function incrementState(name: string) {
  return (state: IErrorStateManagerState) => {
    state[name] += 1;
  };
}

const initialState: IErrorStateManagerState = {
  errors: {
    allErrors: new Map(),
    errorQueue: []
  },
  errorCount: 0
};

export const errorStateManagerReducer = reduceReducers<IErrorStateManagerState>(
  [
    handleAction(allErrorsAction, updateStateWithPayload('errors')),
    handleAction(incrementId, incrementState('errorCount'))
  ],
  initialState
);
