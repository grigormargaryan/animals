import * as type from '../constants/action-types'

const initialState = {
  appSidebar: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case type.OPEN_CLOSE_SIDEBAR:
      return {
        ...state,
        appSidebar: !state.appSidebar,
      };
    default:
      return state
  }
}
