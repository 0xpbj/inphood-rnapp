import {
  LOGIN_SUCCESS, LOGIN_ERROR, INIT_LOGIN,
  LOGOUT_SUCCESS, LOGOUT_ERROR, USER_SETTINGS,
  STORE_TOKEN, STORE_RESULT, STORE_TRAINER,
} from '../constants/ActionTypes'

const initialState = {
  token: '',
  result: null,
  error: null,
  trainer: false,
  inProgress: false,
  settings: {}
}

export default function authentication(state = initialState, action) {
  switch (action.type) {
    case INIT_LOGIN:
      return {
        ...state,
        inProgress: action.flag
      }
    case LOGOUT_SUCCESS:
      return initialState
    case LOGIN_ERROR:
    case LOGOUT_ERROR:
      return {
        ...state,
        error: action.error,
        inProgress: action.flag
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
        result: action.result,
        inProgress: false
      }
    case USER_SETTINGS:
      return {
        ...state,
        settings: action.settings
      }
    case LOGIN_SUCCESS:
    default:
      return state
  }
}