import {
  LOGIN_SUCCESS, LOGIN_ERROR,
  LOGOUT_SUCCESS, LOGOUT_ERROR,
  STORE_TOKEN, STORE_RESULT, STORE_TRAINER,
} from '../constants/ActionTypes';

const initialState = {
  token: '',
  result: null,
  error: null,
  trainer: false,
  user: ''
}

export default function authentication(state = initialState, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        user: action.user
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
    case STORE_TOKEN:
      return {
        ...state,
        token: action.token
      }
    case STORE_TRAINER:
      return {
        ...state,
        trainer: action.flag
      }
    case STORE_RESULT:
      return {
        ...state,
        result: action.result
      }
    default:
      return state
  }
}
