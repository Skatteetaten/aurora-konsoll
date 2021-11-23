import {
  applyMiddleware,
  compose,
  createStore,
  Action,
  Reducer,
  AnyAction,
} from 'redux';
import thunkMiddleware, { ThunkMiddleware } from 'redux-thunk';

import { IApiClients } from 'web/models/AuroraApi';
import {
  RootState,
  RootAction,
  IExtraArguments,
  AsyncAction,
} from 'web/store/types';
import { rootReducer } from 'web/store/rootReducer';
import { getApiClientsMock, GraphQLSeverMock } from 'web/utils//GraphQLMock';

const resetStoreStateAction: Action = {
  type: 'RESET_STORE_STATE',
};

const createStoreWithApi = (clients: IApiClients, initialState: {} = {}) => {
  const enhancer = compose(
    applyMiddleware(
      thunkMiddleware.withExtraArgument({
        clients,
      }) as ThunkMiddleware<RootState, RootAction, IExtraArguments>
    )
  );

  const reducer: Reducer = (state: RootState, action: AnyAction) => {
    if (action.type === resetStoreStateAction.type) {
      // This will make redux reset state
      return undefined;
    }
    return rootReducer(state, action);
  };

  return createStore(reducer, initialState, enhancer);
};

/**
 *
 * @param serverMock
 */
export const createTestStore = (serverMock: GraphQLSeverMock) => {
  const clients = getApiClientsMock(serverMock);
  let store = createStoreWithApi(clients);
  let actionQueue: Action[] = [];

  /**
   * Dispatch will add the given action to an action queue or if action is a function
   * it will send itself as param to action function and collect nested actions.
   * @param action Object or function
   */
  const dispatch = async (action: Action | AsyncAction<Promise<void>>) => {
    if (typeof action === 'function') {
      await action(dispatch, store.getState, { clients });
    } else {
      actionQueue = [action, ...actionQueue];
    }
  };

  /**
   * NextAction will get the next action from the queue and dispatch it with the
   * internal store. It throws error if there are no actions.
   * @param expectedAction assert that next action is expected action. Throws
   * error if assertion fails.
   * @param assertFn function for asserting state changes
   */
  function nextAction(
    expectedAction: Action,
    assertFn: (state: RootState) => void = (state) => {}
  ) {
    const action = actionQueue.pop();
    if (!action) {
      throw new Error('No actions');
    }

    if (action.type !== expectedAction.type) {
      throw new Error(
        `Expected action type ${expectedAction.type}, but was ${action.type}`
      );
    }

    store.dispatch(action);
    const state = store.getState();
    assertFn(state);

    return state;
  }

  /**
   * skipActions will dispatch actions from the queue
   * @param count number of actions to dispatch
   */
  function skipActions(count: number) {
    for (let i = 0; i < count; i++) {
      const action = actionQueue.pop();
      if (action) {
        store.dispatch(action);
      }
    }
  }

  /**
   * For clearing action queue and reset state between tests.
   */
  function clearActionsAndResetState() {
    actionQueue = [];
    store.dispatch(resetStoreStateAction);
  }

  return {
    getActionQueue: () => actionQueue,
    dispatch,
    nextAction,
    skipActions,
    clearActionsAndResetState,
  };
};
