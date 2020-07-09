import apiCall from '../services/apiCall';
import {refreshToken, isAccessTokenExpired} from '../reducers/index';
import * as types from '../constants/action-types';
import {isRefreshTokenExpired} from "../reducers/auth";

export default function requestMiddleware() {
  return ({dispatch, getState}) => next => (action) => {
    const {
      request, type
    } = action;

    if (!request || type === types.TOKEN_REQUEST) {
      return next(action);
    }

    const state = getState();
    const token = refreshToken(state);
    if (token && isAccessTokenExpired(state)) {
      if (isRefreshTokenExpired(state)) {
        return dispatch({type: types.LOGOUT});
      } else {
        return apiCall({
          url: `${process.env.REACT_APP_TEST_API}/staff/auth/refresh-token/`,
          dispatch: dispatch,
          method: 'post',
          data: JSON.stringify({refresh: token}),
          headers: {'Content-Type': 'application/json'},
          types: [types.TOKEN_REQUEST, types.TOKEN_SUCCESS, types.TOKEN_FAILURE],
        });
      }
    }
    return next(action);
  };
}