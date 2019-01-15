import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './rootReducer';

import thunkMiddleware from 'redux-thunk';

function configureStore(initialState?: {}) {
  const middlewares = [thunkMiddleware];
  const enhancer = composeWithDevTools(applyMiddleware(...middlewares));
  return createStore(rootReducer, initialState!, enhancer);
}

const store = configureStore();

export default store;
