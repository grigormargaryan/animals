import * as types from '../constants/action-types';
import  apiCall from '../services/apiCall';


export const loginAction = (data) => {
  return (dispatch) => {
    return apiCall({
      url: `/staff/auth/sign-in`,
      dispatch:dispatch,
      method: 'post',
      data: JSON.stringify(data),
      headers: {'Content-Type': 'application/json'},
      types: [types.LOGIN_REQUEST, types.LOGIN_SUCCESS, types.LOGIN_FAILURE],
    });
  };
};

export const logoutAction = () => {
  return {
    type: types.LOGOUT,
  };
};
