import {
  STORE_TOKEN,
  STORE_RESULT,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOGOUT_SUCCESS,
  LOGOUT_ERROR
} from '../constants/ActionTypes';

const initialState = {
  token: '',
  result: null,
  error: null
}

export default function authentication(state = initialState, action) {
  switch (action.type) {
    case STORE_TOKEN:
      return {
        ...state,
        token: action.token
      }
    case STORE_RESULT:
      return {
        ...state,
        result: action.result
      }
    case LOGOUT_SUCCESS:
      return {
        ...state,
        token: '',
        result: null,
        error: null
      }
    case LOGIN_ERROR:
    case LOGOUT_ERROR:
      return {
        ...state,
        error: action.error
      }
    default:
      return state
  }
}
