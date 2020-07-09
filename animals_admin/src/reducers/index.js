import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';
import { loadingBarReducer } from 'react-redux-loading-bar';
import auth, * as fromAuth from './auth';
import globals from './globals';

export default combineReducers({
  globals: globals,
  auth: auth,
  loadingBar: loadingBarReducer,
  router: routerReducer,
  form:formReducer
});


export const isAuthenticated = state => fromAuth.isAuthenticated(state.auth);
export const authErrors = state => fromAuth.errors(state.auth);
export const getSuccessMsg = state => fromAuth.getSuccessMsg(state.auth);
export const accessToken = state => fromAuth.accessToken(state.auth);
export const isAccessTokenExpired = state => fromAuth.isAccessTokenExpired(state.auth);
export const refreshToken = state => fromAuth.refreshToken(state.auth);


export function withAuth(state, headers = { 'Content-Type': 'application/json' }) {
  return {
    ...headers,
    Authorization: `Bearer ${accessToken(state)}`,
  };
}
