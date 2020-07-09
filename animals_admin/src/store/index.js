import storage from 'redux-persist/es/storage';
import {applyMiddleware,createStore} from 'redux';
import { createFilter } from 'redux-persist-transform-filter';
import { persistReducer, persistStore } from 'redux-persist';
import { composeWithDevTools } from 'redux-devtools-extension';
import createLogger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';

import requestMiddleware from '../middlewares/requestMiddleware';
import { loadingBarMiddleware } from 'react-redux-loading-bar';
import rootReducer from '../reducers';

export default history => {
  const persistedAuthFilter = createFilter('auth', ['access', 'refresh', 'user']);
  const persistedGlobalsFilter = createFilter('globals', ['appSidebar']);
  const middlewareHistory = routerMiddleware(history);
  const reducer = persistReducer(
    {
      key: 'levelhunt',
      storage: storage,
      whitelist: ['auth', 'globals'],
      transforms: [persistedAuthFilter, persistedGlobalsFilter]
    },
    rootReducer
  );
  const middlewares = [thunkMiddleware, createLogger, middlewareHistory, requestMiddleware(),  loadingBarMiddleware({
      promiseTypeSuffixes: ['REQUEST', 'SUCCESS', 'FAILURE'],
  })];
  const store = createStore(
    reducer,
    {},
    composeWithDevTools(applyMiddleware(...middlewares))
  );


  return new Promise((resolve, reject) => {
    persistStore(store, null, () => {
      resolve(store);
    });
  });
};
