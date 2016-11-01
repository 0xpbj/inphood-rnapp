import {
  LOGIN_SUCCESS, LOGIN_ERROR, INIT_LOGIN,
  LOGOUT_SUCCESS, LOGOUT_ERROR, USER_SETTINGS,
  STORE_TOKEN, STORE_RESULT, STORE_VALUE, EM_CREATE_USER,
  EM_LOGIN_REQUEST, BRANCH_REFERRAL_INFO, BRANCH_AUTH_TRAINER
} from '../constants/ActionTypes'
import {REHYDRATE} from 'redux-persist/constants'

const initialState = {
  token: '',
  result: null,
  error: null,
  inProgress: false,
  value: null,
  settings: {},
  referralSetup: false,
  referralType: '',
  referralId: '',
  authTrainer: 'pending',
  trainerName: '',
  data: null
}

export default function authentication(state = initialState, action) {
  switch (action.type) {
    case INIT_LOGIN:
      return {
        ...state,
        inProgress: action.flag
      }
    case EM_CREATE_USER:
      return {
        ...state,
        data: action.value
      }
    case LOGOUT_SUCCESS:
      return {
        ...initialState
      }
    case LOGIN_ERROR:
      return {
        ...initialState,
        value: null,
        error: error
      }
    case LOGOUT_ERROR:
      return {
        ...state,
        error: action.error,
      }
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
    case STORE_VALUE:
      return {
        ...state,
        value: action.value
      }
    case USER_SETTINGS:
      return {
        ...state,
        settings: action.settings
      }
    case EM_LOGIN_REQUEST:
      return {
        ...state,
        value: action.value
      }
    case BRANCH_REFERRAL_INFO:
      return {
        ...state,
        referralSetup: action.referralSetup,
        referralType: action.referralType,
        referralId: action.referralId,
        trainerName: action.trainerName
      }
    case BRANCH_AUTH_TRAINER:
      return {
        ...state,
        authTrainer: action.response
      }
    case LOGIN_SUCCESS:
      return {
        ...state,
        error: ''
      }
    default:
      return state
  }
}