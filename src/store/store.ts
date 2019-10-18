import { applyMiddleware, compose, createStore } from 'redux';
import { rootReducer } from './rootReducer';

import { IApiClients } from 'components/AuroraApi';
import thunkMiddleware from 'redux-thunk';

const composeEnhancers =
  typeof window === 'object' &&
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        serialize: true,
        latency: 0,
        features: { persist: false }
      })
    : compose;

const createStoreWithApi = (clients: IApiClients, initialState?: {}) => {
  const middlewares = [
    thunkMiddleware.withExtraArgument({
      clients
    })
  ];
  const enhancer = composeEnhancers(applyMiddleware(...middlewares));
  return createStore(rootReducer, initialState!, enhancer);
};

export default createStoreWithApi;
