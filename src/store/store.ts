import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './rootReducer';

import { IApiClients } from 'components/AuroraApi';
import thunkMiddleware from 'redux-thunk';

// const composeEnhancers =
//   (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
//   (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
//     serializeAction: true
//   });

const createStoreWithApi = (clients: IApiClients, initialState?: {}) => {
  const middlewares = [
    thunkMiddleware.withExtraArgument({
      clients
    })
  ];
  const enhancer = composeWithDevTools(applyMiddleware(...middlewares));
  return createStore(rootReducer, initialState!, enhancer);
};

export default createStoreWithApi;
