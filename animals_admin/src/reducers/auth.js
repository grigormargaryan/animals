import jwtDecode from 'jwt-decode';
import * as type from '../constants/action-types';

const initialState = {
  access: '',
  refresh: '',
  errors: [],
  articles: [],
  successMsg: '',
  user: {
    avatar:'',
    firstName: '',
    lastName: '',
    phone: '',
  }
};

export default (state = initialState, action) => {
  switch (action.type) {
    case type.LOGIN_SUCCESS:
      return {
        ...state,
        access: {
          token: action.payload.access_token,
          ...jwtDecode(action.payload.access_token)
        },
        refresh: {
          token: action.payload.refresh_token,
          ...jwtDecode(action.payload.refresh_token)
        },
        user: action.payload.user,
      };
    case type.TOKEN_SUCCESS:
      return {
        ...state,
        access: {
          token: action.payload.access_token,
          ...jwtDecode(action.payload.access_token)
        },
        refresh: {
          token: action.payload.refresh_token,
          ...jwtDecode(action.payload.refresh_token)
        },
      };
    case type.LOGOUT:
    case type.TOKEN_FAILURE:
      return {
        user: initialState.user,
        access: undefined,
        refresh: undefined
      };
    case type.LOGIN_FAILURE:
      return {
        ...state,
        access: undefined,
        refresh: undefined,
        errors: action.payload.message
      };
    default:
      return state;
  }
};


export function accessToken(state) {
  if (state.access) {
    return state.access.token;
  }
}

export function refreshToken(state) {
  if (state.refresh) {
    return state.refresh.token;
  }
}

export function isRefreshTokenExpired(state) {
  if (state.refresh && state.refresh.exp) {
    return 1000 * state.refresh.exp - new Date().getTime() < 5000;
  }
  return true;
}

export function isAccessTokenExpired(state) {
  if (state.access && state.access.exp) {
    return 1000 * state.access.exp - new Date().getTime() < 5000;
  }
  return true;
}


export function isAuthenticated(state) {
  return !isRefreshTokenExpired(state);
}


export function errors(state) {
  return state.errors;
}

export function getSuccessMsg(state) {
  return state.successMsg;
}