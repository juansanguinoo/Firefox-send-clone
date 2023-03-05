import { 
  REGISTER_SUCCESS, 
  REGISTER_ERROR, 
  CLEAN_ALERT, 
  LOGIN_SUCCESS, 
  LOGIN_ERROR, 
  AUTHENTICATED_USER, 
  LOG_OUT 
} from "../../types";

export default (state, action) => {
  switch (action.type) {
    case REGISTER_SUCCESS:
    case REGISTER_ERROR:
    case LOGIN_ERROR:
      return {
        ...state,
        message: action.payload
      }
    case LOGIN_SUCCESS:
      return {
        ...state, 
        token: action.payload,
        authenticated: true,
      }
      case CLEAN_ALERT:
        return {
          ...state,
          message: null
        }
      case AUTHENTICATED_USER:
        return {
          ...state,
          user: action.payload,
          authenticated: true,
        }
      case LOG_OUT:
        return {
          ...state,
          authenticated: null,
          token: null,
          user: null,
        }
    default:
      return state;
  }
}